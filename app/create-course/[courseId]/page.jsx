"use client";

import { db } from "@/config/db";
import { CourseList } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, use, useState } from "react";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";

const CourseLayout = ({ params }) => {
  const { user } = useUser();
  const { courseId } = use(params);
  const [course, setCourse] = useState([]);

  useEffect(() => {
    params && getCourse();
  }, [user, params]);

  const getCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(
        and(
          eq(CourseList.courseId, courseId),
          eq(CourseList.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      );

    setCourse(result[0]);
    console.log(result[0]);
  };

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44 mb-8">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>

      {/* Basic Info */}
      <CourseBasicInfo course={course} refreshData={() => getCourse()} />

      {/* COurse Details */}
      <CourseDetail course={course} />

      {/* List of Lesson */}
      <ChapterList course={course} refreshData={() => getCourse()} />
    </div>
  );
};

export default CourseLayout;
