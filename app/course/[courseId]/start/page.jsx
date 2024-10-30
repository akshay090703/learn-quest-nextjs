"use client";

import { db } from "@/config/db";
import { CourseList } from "@/config/schema";
import { eq } from "drizzle-orm";
import React, { use, useEffect } from "react";

const CourseStart = ({ params }) => {
  const { courseId } = use(params);

  useEffect(() => {
    params && getCourse();
  }, [params]);

  //   Used to get the course info by using the course Id
  const getCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList?.courseId, courseId));

    console.log(result);
  };

  return <div>start</div>;
};

export default CourseStart;
