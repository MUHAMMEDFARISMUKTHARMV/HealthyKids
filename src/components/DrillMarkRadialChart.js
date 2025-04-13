"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Loader2 } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
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

export default function DrillMarkBarChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Create dynamic chart config based on data
  const chartConfig = {
    students: {
      label: "Students",
    },
    drillMark0: {
      label: "DrillMark 0",
      color: "hsl(var(--chart-1))",
    },
    drillMark1: {
      label: "DrillMark 1",
      color: "hsl(var(--chart-2))",
    },
    drillMark2: {
      label: "DrillMark 2",
      color: "hsl(var(--chart-3))",
    },
    drillMark3: {
      label: "DrillMark 3",
      color: "hsl(var(--chart-4))",
    },
    drillMark4: {
      label: "DrillMark 4",
      color: "hsl(var(--chart-5))",
    },
    drillMark5: {
      label: "DrillMark 5",
      color: "#E77B52",
    },
  }

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api?type=DrillMarkRadialChart&startDate=${startDate}&endDate=${endDate}`);

        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();

        // Format data using CSS var color scheme matching chart config
        const formatted = result.map((item) => {
          const drillMarkKey = `drillMark${item.DrillMark}`;
          return {
            drillMark: drillMarkKey,
            students: item.CountOfStudents,
            fill: `var(--color-${drillMarkKey})`,
          };
        }).sort((a, b) => {
          // Sort by drill mark number (extract number from drillMarkX)
          const aNumber = parseInt(a.drillMark.replace("drillMark", ""));
          const bNumber = parseInt(b.drillMark.replace("drillMark", ""));
          return aNumber - bNumber;
        });

        setData(formatted);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  // Calculate total students
  const totalStudents = data.reduce((sum, item) => sum + item.students, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Drill Mark Distribution</CardTitle>
        <CardDescription>Student count by drill mark level</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading chart data...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-destructive">
            <p className="font-semibold">Error loading chart data</p>
            <p className="text-sm text-muted-foreground mt-2">{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No drill mark data available</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{
                left: 0,
              }}
              height={400}
            >
              <YAxis
                dataKey="drillMark"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  chartConfig[value]?.label || value
                }
              />
              <XAxis dataKey="students" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="students" layout="vertical" radius={5} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      {!loading && !error && data.length > 0 && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Total students: {totalStudents.toLocaleString()} <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing student distribution across all drill marks between {startDate} and {endDate}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}