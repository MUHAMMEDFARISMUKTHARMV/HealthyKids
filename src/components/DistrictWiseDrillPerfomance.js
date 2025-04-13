"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Loader2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
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
  TotalAttempts: {
    label: "Total Attempts",
    color: "hsl(var(--chart-1))",
  },
  CompletedDrills: {
    label: "Completed Drills",
    color: "hsl(var(--chart-2))",
  },
}

export default function DistrictWiseDrillPerformance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api?type=DistrictWiseDrillPerfomance&startDate=${startDate}&endDate=${endDate}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();

        const formatted = result.map(item => ({
          DistrictID: item.DistrictID,
          TotalAttempts: parseInt(item.TotalAttempts),
          CompletedDrills: parseInt(item.CompletedDrills),
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

  // Calculate completion rate if data is available
  const completionRate = data.length && data.reduce((sum, item) => sum + item.TotalAttempts, 0) > 0
    ? (data.reduce((sum, item) => sum + item.CompletedDrills, 0) / 
       data.reduce((sum, item) => sum + item.TotalAttempts, 0) * 100).toFixed(1)
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
        <CardTitle>District-wise Drill Performance</CardTitle>
        <CardDescription>Attempts vs Completions</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart 
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
                label={{ value: "District ID", position: "bottom", offset: -10 }}
              
                tickMargin={10}
              />
              <YAxis
                label={{ value: "Count", angle: -90, position: "insideLeft", offset: -5 }}
                fillOpacity={0.4}

              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar 
                dataKey="TotalAttempts" 
                fill="var(--color-TotalAttempts)" 
                radius={4} 
              />
              <Bar 
                dataKey="CompletedDrills" 
                fill="var(--color-CompletedDrills)" 
                radius={4} 
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-60">
            <p className="text-muted-foreground">No district data available</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Completion rate: {completionRate}% across all districts <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing drill comparison by district
        </div>
      </CardFooter>
    </Card>
  );
}