import React from 'react';
import DateRangeSelector from '../components/DateRangeSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="relative p-6 bg-white shadow-md rounded-lg w-[800px] mx-auto mt-10">
      <Card className="">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-bold text-gray-800 ">School Drill Report</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-center text-gray-600 mt-2">Select Date Range For School Drill Report Generation</p>

          <DateRangeSelector />
        </CardContent>
      </Card>
    </div>
  );
}

