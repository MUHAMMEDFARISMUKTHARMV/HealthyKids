import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const start_date = searchParams.get("start_date");
  const end_date = searchParams.get("end_date");
  const type = searchParams.get("type");

  console.log("Received parameters:", { start_date, end_date, type });

  try {
    if (type === "AttendenceDistribution") {
      const { data, error } = await supabase.rpc("get_attendance_distribution", {
        start_date,
        end_date,
      });

      if (error) {
        console.error("Supabase Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log("Supabase Data:", data);
      return NextResponse.json(data);

    } else if (type === "DrillMarkDoubleBar") {
      const { data, error } = await supabase.rpc("get_drill_mark_distribution", {
        start_date,
        end_date,
      });

      if (error) {
        console.error("Supabase Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log("Supabase Data:", data);
      return NextResponse.json(data);

    } else if (type === "DrillsAttemptedBySchool") {
      const { data, error } = await supabase.rpc("get_drills_attempted_by_school", {
        start_date,
        end_date,
      });

      if (error) {
        console.error("Supabase Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log("Supabase Data:", data);
      return NextResponse.json(data);

    }else if (type === "MonthlyDrillActivity") {
      const { data, error } = await supabase.rpc("get_monthly_drill_activity", {});

      if (error) {
        console.error("Supabase Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log("Supabase Data:", data);
      return NextResponse.json(data);

    }else if (type === "DistrictWiseDrillPerfomance") {
      const { data, error } = await supabase.rpc("get_district_wise_drill_performance", {
        start_date,
        end_date,
      });

      if (error) {
        console.error("Supabase Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log("Supabase Data:", data);
      return NextResponse.json(data);

    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Supabase Error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
