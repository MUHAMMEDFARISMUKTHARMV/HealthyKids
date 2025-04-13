import React from 'react';
import DateRangeSelector from '../components/DateRangeSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">School Drill Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-lg mb-4 text-center">Select Date Range for Analysis</h2>
          <DateRangeSelector />
        </CardContent>
      </Card>
    </div>
  );
}

