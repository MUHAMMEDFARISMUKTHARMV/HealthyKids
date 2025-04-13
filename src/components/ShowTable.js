"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ShowTable() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  useEffect(() => {
    fetch(`/api?type=DistrictWiseDrillPerfomance&startDate=${startDate}&endDate=${endDate}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.error) throw new Error(result.error);
        setData(result);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data.length) return <p>Loading...</p>;

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
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
