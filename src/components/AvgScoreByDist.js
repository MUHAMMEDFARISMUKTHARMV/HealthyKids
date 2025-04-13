"use client"
import { useState, useEffect } from "react"
import { TrendingUp, Loader2 } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { useSearchParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,   
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  avgScore: {
    label: "Average Score",
    color: "hsl(var(--chart-1))",
  }
}

export default function AvgScoreByDist() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api?type=DistrictWiseDrillPerfomance&startDate=${startDate}&endDate=${endDate}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();

        const formatted = result.map(item => ({
          DistrictID: item.DistrictID,
          AvgScore: item.AvgScore
        }));

        setData(formatted);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  // Calculate metrics if data is available
  const avgScoreTotal = data.length 
    ? data.reduce((sum, item) => sum + item.AvgScore, 0) / data.length 
    : 0;
    
  const completionRate = data.length
    ? data.reduce((sum, item) => sum + item.CompletedDrills, 0) / 
      data.reduce((sum, item) => sum + item.TotalAttempts, 0) * 100
    : 0;

  if (loading) {
    return (
      <Card className="w-full h-80 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading district data...</span>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-80 flex items-center justify-center">
        <div className="text-center text-destructive">
          <p className="font-semibold">Error loading district data</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle>District Performance Analysis</CardTitle>
        <CardDescription>Average Score by District ID</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 20,
                right: 20,
                top: 10,
                bottom: 10
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="DistrictID"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                label={{
                  value: "Average Score",
                  position: "insideLeft",
                  offset: 180,
                  dy: 20,
                  style: { fontWeight: "bold" }
                }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tickCount={7} 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                label={{
                  value: "Average Score",
                  angle: -90,
                  position: "insideBottom",
                  offset: 120,
                  dx: -12,
                  style: { fontWeight: "bold" }
                 }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Line
                dataKey="AvgScore"
                name="Average Score"
                type="monotone"
                stroke="var(--color-avgScore)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-avgScore)",
                  r: 4
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-60">
            <p className="text-muted-foreground">No district data available</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Overall average: {avgScoreTotal.toFixed(2)} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Completion rate: {completionRate.toFixed(2)}% across all districts
        </div>
      </CardFooter>
    </Card>
  );
}