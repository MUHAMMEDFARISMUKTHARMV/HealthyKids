export const queries = {
    schoolPerformance: `
      SELECT 
        s.SchoolID,
        s.SchoolName,
        COUNT(DISTINCT sc.SchoolClassID) AS TotalClasses,
        COUNT(DISTINCT st.StudID) AS TotalStudents,
        COUNT(sdf.StudFeedID) AS TotalDrillsAttempted,
        SUM(CASE WHEN sdf.Achived = 'Y' THEN 1 ELSE 0 END) AS TotalDrillsAchieved,
        ROUND(SUM(CASE WHEN sdf.Achived = 'Y' THEN 1 ELSE 0 END) * 100.0 / COUNT(sdf.StudFeedID), 2) AS AchievementRate
      FROM 
        school s
      LEFT JOIN 
        school_class sc ON s.SchoolID = sc.SchoolID
      LEFT JOIN 
        students st ON sc.SchoolClassID = st.SchoolClassID
      LEFT JOIN 
        student_drill_feedback sdf ON st.StudID = sdf.StudID
      WHERE
        (sdf.DrillDate BETWEEN ? AND ?) OR sdf.DrillDate IS NULL
      GROUP BY 
        s.SchoolID, s.SchoolName
      HAVING 
        COUNT(sdf.StudFeedID) > 0
      ORDER BY 
        AchievementRate DESC, TotalDrillsAttempted DESC
    `,
    
    classLevelPerformance: `
      SELECT 
        sc.Class,
        COUNT(DISTINCT st.StudID) AS TotalStudents,
        COUNT(sdf.StudFeedID) AS TotalDrillsAttempted,
        SUM(CASE WHEN sdf.Achived = 'Y' THEN 1 ELSE 0 END) AS TotalDrillsAchieved,
        ROUND(SUM(CASE WHEN sdf.Achived = 'Y' THEN 1 ELSE 0 END) * 100.0 / COUNT(sdf.StudFeedID), 2) AS AchievementRate
      FROM 
        school_class sc
      LEFT JOIN 
        students st ON sc.SchoolClassID = st.SchoolClassID
      LEFT JOIN 
        student_drill_feedback sdf ON st.StudID = sdf.StudID
      WHERE
        (sdf.DrillDate BETWEEN ? AND ?) OR sdf.DrillDate IS NULL
      GROUP BY 
        sc.Class
      HAVING 
        COUNT(sdf.StudFeedID) > 0
      ORDER BY 
        sc.Class
    `,
    
    drillDifficulty: `
      SELECT 
        kd.DrillID,
        kd.DrillName,
        kd.Class AS RecommendedClass,
        COUNT(sdf.StudFeedID) AS TotalAttempts,
        SUM(CASE WHEN sdf.Achived = 'Y' THEN 1 ELSE 0 END) AS TotalAchieved,
        ROUND(SUM(CASE WHEN sdf.Achived = 'Y' THEN 1 ELSE 0 END) * 100.0 / COUNT(sdf.StudFeedID), 2) AS AchievementRate,
        AVG(CAST(sdf.DrillMark AS DECIMAL(10,2))) AS AverageScore
      FROM 
        kids_drills kd
      LEFT JOIN 
        student_drill_feedback sdf ON kd.DrillID = sdf.DrillID
      WHERE
        (sdf.DrillDate BETWEEN ? AND ?) OR sdf.DrillDate IS NULL
      GROUP BY 
        kd.DrillID, kd.DrillName, kd.Class
      HAVING 
        COUNT(sdf.StudFeedID) >= 50  -- Only include drills with sufficient data
      ORDER BY 
        AchievementRate ASC, TotalAttempts DESC
      LIMIT 10
    `,
    
    teacherEffectiveness: `
      SELECT 
        m.MembID,
        m.MembName AS TeacherName,
        COUNT(DISTINCT sc.SchoolClassID) AS ClassesManaged,
        COUNT(DISTINCT sdf.StudID) AS StudentsInstructed,
        COUNT(sdf.StudFeedID) AS TotalDrillsMonitored,
        SUM(CASE WHEN sdf.Achived = 'Y' THEN 1 ELSE 0 END) AS SuccessfulDrills,
        ROUND(SUM(CASE WHEN sdf.Achived = 'Y' THEN 1 ELSE 0 END) * 100.0 / COUNT(sdf.StudFeedID), 2) AS SuccessRate
      FROM 
        members m
      JOIN 
        school_class sc ON m.MembID = sc.MembID
      JOIN 
        student_drill_feedback sdf ON sc.SchoolClassID = sdf.SchoolClassID AND sdf.MembID = m.MembID
      WHERE
        (sdf.DrillDate BETWEEN ? AND ?) OR sdf.DrillDate IS NULL
      GROUP BY 
        m.MembID, m.MembName
      HAVING 
        COUNT(sdf.StudFeedID) >= 100  -- Only include teachers with sufficient data
      ORDER BY 
        SuccessRate DESC, TotalDrillsMonitored DESC
    `,
    
    trendAnalysis: `
      SELECT 
        DATE_FORMAT(sdh.DrillStartDate, '%Y-%m') AS Month,
        COUNT(sdh.DlogID) AS DrillsStarted,
        COUNT(CASE WHEN sdh.Completed = 'C' THEN 1 END) AS DrillsCompleted,
        ROUND(COUNT(CASE WHEN sdh.Completed = 'C' THEN 1 END) * 100.0 / COUNT(sdh.DlogID), 2) AS CompletionRate
      FROM 
        school_drill_history1 sdh
      WHERE 
        sdh.DrillStartDate BETWEEN ? AND ?
      GROUP BY 
        DATE_FORMAT(sdh.DrillStartDate, '%Y-%m')
      ORDER BY 
        Month
    `
  };