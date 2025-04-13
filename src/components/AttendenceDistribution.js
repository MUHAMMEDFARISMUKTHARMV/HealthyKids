"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { useSearchParams } from "next/navigation";



const COLORS = ["#E76B52", "#2CA4A4"] // Green for 'P', Red for 'A'

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

export default function AttendancePieChart() {
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

        const response = await fetch(`/api?type=AttendenceDistribution&startDate=${startDate}&endDate=${endDate}`);
        
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();

        const formattedData = result.map(item => ({
          status: item.StuAttend === "P" ? "Present" : "Absent",
          count: item.Count,
        }));

        setData(formattedData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate] );

  const total = data.reduce((acc, item) => acc + item.count, 0);

  // 👉 Dynamic insight computation
const presentData = data.find(d => d.status === "Present");
const absentData = data.find(d => d.status === "Absent");

const presentPercent = ((presentData?.count || 0) / total * 100).toFixed(1);
const absentPercent = ((absentData?.count || 0) / total * 100).toFixed(1);

const insight = `${presentPercent}% of students were present, while ${absentPercent}% were absent during the selected period. This attendance trend provides a clear view of student participation.`;

  return (
    <Card>
      <CardHeader  className="items-center pb-0">
        <CardTitle>Student Attendance Distribution</CardTitle>
        <CardDescription>Present vs Absent</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={80}
                  outerRadius={160}
                  fillOpacity={0.7}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] } />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} students`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
      {!loading && !error && (
        <CardFooter className="text-sm text-gray-500 flex flex-col gap-1">
        <div>Total students marked: {total.toLocaleString()}</div>
        <div>{insight}</div>
      </CardFooter>
      )}
    </Card>
  )
}
