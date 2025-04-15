"use client"
import { useEffect, useState } from "react";

export default function ShowTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api?type=AttendenceDistribution`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then((result) => {
        if (result.error) throw new Error(result.error);
        setData(result);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
  if (!data.length) return <p>No data available</p>;

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="border border-gray-300 px-4 py-2 bg-gray-100">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {headers.map((header) => (
                <td key={header} className="border px-4 py-2">
                  {typeof row[header] === 'number' ? 
                    header.includes('Avg') ? 
                      row[header].toFixed(2) : 
                      row[header].toLocaleString() 
                    : row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}