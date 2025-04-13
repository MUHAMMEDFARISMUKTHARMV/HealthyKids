'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

export default function DateRangeSelector() {
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 3)));
  const [endDate, setEndDate] = useState(new Date());
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const start = format(startDate, 'yyyy-MM-dd');
    const end = format(endDate, 'yyyy-MM-dd');
    console.log('Selected Date Range:', start, end);
    router.push(`/dashboard?startDate=${start}&endDate=${end}`);


  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Start Date</label>
        <Calendar
          mode="single"
          selected={startDate}
          onSelect={setStartDate}
          className="border rounded-md p-2"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">End Date</label>
        <Calendar
          mode="single"
          selected={endDate}
          onSelect={setEndDate}
          className="border rounded-md p-2"
        />
      </div>
      
      <Button type="submit" className="w-full">
        View Dashboard
      </Button>
    </form>
  );
}
