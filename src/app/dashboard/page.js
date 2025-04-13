import DashboardHeader from "@/components/DashboardHeader";
import AttendenceDistribution from "@/components/AttendenceDistribution";
import DrillMarkDoubleBar from "@/components/DrillMarkDoubleBar";
import DrillsAttemptedBySchool from "@/components/DrillsAttemptedBySchool";
import MonthlyDrillActivity from "@/components/MonthlyDrillActivity";
import DistrictWiseDrillPerfomance from "@/components/DistrictWiseDrillPerfomance";
import AvgScoreByDist from "@/components/AvgScoreByDist";
export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader />
    <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <MonthlyDrillActivity />
      <DistrictWiseDrillPerfomance />
      <AttendenceDistribution />
      <AvgScoreByDist />
      <DrillMarkDoubleBar />
      <DrillsAttemptedBySchool />
      
    </main>
    </div>
  );
}
