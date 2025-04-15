import { Suspense } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import AttendenceDistribution from "@/components/AttendenceDistribution";
import DrillMarkDoubleBar from "@/components/DrillMarkDoubleBar";
import DrillsAttemptedBySchool from "@/components/DrillsAttemptedBySchool";
import MonthlyDrillActivity from "@/components/MonthlyDrillActivity";
import DistrictWiseDrillPerfomance from "@/components/DistrictWiseDrillPerfomance";
import AvgScoreByDist from "@/components/AvgScoreByDist";

// Disable static page generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<div>Loading monthly activity...</div>}>
          <MonthlyDrillActivity />
        </Suspense>
        <Suspense fallback={<div>Loading district performance...</div>}>
          <DistrictWiseDrillPerfomance />
        </Suspense>
        <Suspense fallback={<div>Loading attendance distribution...</div>}>
          <AttendenceDistribution />
        </Suspense>
        <Suspense fallback={<div>Loading average scores...</div>}>
          <AvgScoreByDist />
        </Suspense>
        <Suspense fallback={<div>Loading drill marks...</div>}>
          <DrillMarkDoubleBar />
        </Suspense>
        <Suspense fallback={<div>Loading school drills...</div>}>
          <DrillsAttemptedBySchool />
        </Suspense>
      </main>
    </div>
  );
}