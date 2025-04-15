"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { useSearchParams } from "next/navigation"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  DrillsStarted: {
    label: "Drills Started",
    color: "hsl(var(--chart-1))",
  },
  DrillsCompleted: {
    label: "Drills Completed",
    color: "hsl(var(--chart-2))",
  },
};
export default function MonthlyDrillActivity() {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
    

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api?type=MonthlyDrillActivity&startDate=${startDate}&endDate=${endDate}`);
  
        if (!response.ok) throw new Error("Failed to fetch data");
  
        const result = await response.json();
  
        const formatted = result.map((item=> ({
          month: item.month,
          DrillsStarted: item.drills_started,
          DrillsCompleted: item.drills_completed,
        })));
  
        setChartData(formatted);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, [startDate, endDate]);

  return (
    <Card>
      <CardHeader  className="items-center pb-0">
        <CardTitle>Monthly Drills Activity</CardTitle>
        <CardDescription>
          Drills started vs completed (latest 6 months)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading chart...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  label={{
                    value: "Month",
                    position: "insideBottom",
                    offset: -5,
                    fontWeight: "bold",
                    fontSize: 16 
                  }}
                />
                <YAxis
                  label={{
                    value: "Drills Count",
                    angle: -90,
                    position: "insideLeft",
                    fontWeight: "bold",
                    fontSize: 16 
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="DrillsStarted"
                  type="monotone"
                  fill="var(--color-DrillsStarted)"
                  fillOpacity={0.6}
                  stroke="var(--color-DrillsStarted)"
                  stackId="a"
                />
                <Area
                  dataKey="DrillsCompleted"
                  type="monotone"
                  fill="var(--color-DrillsCompleted)"
                  fillOpacity={0.6}
                  stroke="var(--color-DrillsCompleted)"
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
            Last 6 months of drill activity <TrendingUp className="h-4 w-4" />
          </div>
              <div className="text-muted-foreground">
              ⚡ Notable spike in activity seen from Jan 2025 onward. Completion rates remained high, indicating consistent follow-through. Recent dip in March may require intervention.
              </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
