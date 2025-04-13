"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useSearchParams } from "next/navigation";


// Card components (same as before)
const Card = ({ className, children, ...props }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className || ''}`} {...props}>
    {children}
  </div>
);
const CardHeader = ({ className, children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className || ''}`} {...props}>
    {children}
  </div>
);
const CardTitle = ({ className, children, ...props }) => (
  <h3 className={`text-lg font-semibold ${className || ''}`} {...props}>
    {children}
  </h3>
);
const CardDescription = ({ className, children, ...props }) => (
  <p className={`text-sm text-gray-500 ${className || ''}`} {...props}>
    {children}
  </p>
);
const CardContent = ({ className, children, ...props }) => (
  <div className={`p-6 pt-0 ${className || ''}`} {...props}>
    {children}
  </div>
);
const CardFooter = ({ className, children, ...props }) => (
  <div className={`flex p-6 pt-0 ${className || ''}`} {...props}>
    {children}
  </div>
);

// Tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
        <p className="font-medium">{payload[0].payload.SchoolName}</p>
        <p className="font-medium">Total Drills Attempted: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const Spinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// 📊 Bar chart component
export default function TotalDrillsBySchoolChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api?type=DrillsAttemptedbySchool&startDate=${startDate}&endDate=${endDate}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();

        const formatted = result.map(item => ({
          SchoolName: item.SchoolName,
          TotalDrillsAttempted: item.TotalDrillsAttempted
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

  const highest = data.reduce((max, item) => item.TotalDrillsAttempted > max ? item.TotalDrillsAttempted : max, 0);
  const topSchool = data.find(item => item.TotalDrillsAttempted === highest)?.SchoolName;

  return (
    <Card className="w-full">
      <CardHeader className="center">
        <CardTitle>Total Drills Attempted by School</CardTitle>
        <CardDescription>Shows how many drills each school attempted</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            Error loading data: {error}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            No data available
          </div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
               <XAxis
                  dataKey="SchoolName"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={60}
                   label={{
                   value: "School Name",
                   position: "insideBottom",
                   offset: -60,
                   style: { fontWeight: "bold" }
                  }}
                />
                <YAxis
                  label={{
                    value: "Total Drills Attempted",
                    angle: -90,
                    offset: -20,
                    position: "insideLeft",
                    style: { fontWeight: "bold" }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="TotalDrillsAttempted" fill="#2CA4A4" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
      {!loading && !error && data.length > 0 && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="text-gray-500">
            Top school: {topSchool} ({highest} drills)
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
