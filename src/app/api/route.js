import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const type = searchParams.get("type");

  console.log("Received Dates:", { startDate, endDate }); // Log before processing

  let connection;
  try {
    connection = await pool.getConnection();

    switch (type) {
      case "AttendenceDistribution": {
        const [rows] = await connection.query(`
          SELECT 
              StuAttend,
              COUNT(DISTINCT StudID) AS Count
          FROM 
              student_drill_feedback
          WHERE 
              SubmittedDate BETWEEN ? AND ?
          GROUP BY 
              StuAttend;
        `,
        [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
        
        return NextResponse.json(rows);

      }

      case "DrillMarkRadialChart": {
        const [rows] = await connection.query(`
          SELECT 
              DrillMark, 
              COUNT(DISTINCT StudID) AS CountOfStudents
          FROM 
              student_drill_feedback
          WHERE 
              SubmittedDate BETWEEN ? AND ?
          GROUP BY 
              DrillMark
          ORDER BY 
              DrillMark;
        `,
        [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
        return NextResponse.json(rows);
      }

      case "DrillsAttemptedbySchool": {
        const [rows] = await connection.query(`
          SELECT 
                sch.SchoolName,
                COUNT(sdf.StudFeedID) AS TotalDrillsAttempted
                            FROM student_drill_feedback sdf
                JOIN students st ON sdf.StudID = st.StudID
                JOIN school_class sc ON st.SchoolClassID = sc.SchoolClassID
                JOIN school sch ON sc.SchoolID = sch.SchoolID
                WHERE 
            		  SubmittedDate BETWEEN ? AND ?
                GROUP BY sch.SchoolName
                ORDER BY TotalDrillsAttempted DESC
                LIMIT 10;
        `,
        [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
        return NextResponse.json(rows);
      }

      case "MonthlyDrillActivity": {
        const [rows] = await pool.query(`
          SELECT * from drillcompletiontrendanalysis;
        `);
        return NextResponse.json(rows);
      }

      case "DistrictWiseDrillPerfomance": {
        const [rows] = await connection.query(`
          SELECT 
                d.DistrictID,
                COUNT(fb.StudID) AS TotalAttempts,
                SUM(CASE WHEN fb.Achived = 'Y' THEN 1 ELSE 0 END) AS CompletedDrills,
                AVG(fb.DrillMark) AS AvgScore
            FROM student_drill_feedback fb
            JOIN students st ON fb.StudID = st.StudID
            JOIN school s ON st.SchoolID = s.SchoolID
            JOIN school_class sc ON fb.SchoolClassID = sc.SchoolClassID
            JOIN districts d ON s.DistrictID = d.DistrictID
            WHERE SubmittedDate BETWEEN ? AND ?
            GROUP BY d.DistrictID
            ORDER BY d.DistrictID ASC;
        `,[`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
        return NextResponse.json(rows);
      }

      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
    }
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
