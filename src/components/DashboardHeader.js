"use client"
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";

export default function DashboardHeader() {
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const formattedStartDate = startDate ? format(new Date(startDate), 'dd MMM yyyy') : '';
  const formattedEndDate = endDate ? format(new Date(endDate), 'dd MMM yyyy') : '';

  return (
    <div className="w-full py-6 bg-white border-b">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Performance Report
      </h1>
      <p className="text-center text-gray-600 mt-2">
        {startDate && endDate ? `Period: ${formattedStartDate} to ${formattedEndDate}` : 'Select date range'}
      </p>
    </div>
  );
}