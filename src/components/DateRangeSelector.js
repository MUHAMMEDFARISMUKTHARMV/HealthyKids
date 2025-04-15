'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

export default function DateRangeSelector() {
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 3)));
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const start = format(startDate, 'yyyy-MM-dd');
    const end = format(endDate, 'yyyy-MM-dd');
    console.log('Selected Date Range:', start, end);
    router.push(`/dashboard?startDate=${start}&endDate=${end}`);
  };

  return (
    <div className="relative  p-6 bg-white shadow-md rounded-lg w-[700px] mx-auto mt-10 " >

      {/* Centered Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p- rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <span className="text-lg font-medium">Loading dashboard...</span>
          </div>
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-3xl">
        <div className="flex justify-between gap-4">
          <div className="flex-gap-4">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              className="border rounded-md p-2 w-full"
            />
          </div>
          <div className="flex-gap-4">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              className="border rounded-md p-2 w-full"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          View Dashboard
        </Button>
      </form>
    </div>
  );
}
