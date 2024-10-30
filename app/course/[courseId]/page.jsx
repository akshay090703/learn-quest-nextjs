"use client";

import Header from "@/app/_components/Header";
import ChapterList from "@/app/create-course/[courseId]/_components/ChapterList";
import CourseBasicInfo from "@/app/create-course/[courseId]/_components/CourseBasicInfo";
import CourseDetail from "@/app/create-course/[courseId]/_components/CourseDetail";
import { db } from "@/config/db";
import { CourseList } from "@/config/schema";
import { eq } from "drizzle-orm";
import React, { use, useEffect, useState } from "react";

const Course = ({ params }) => {
  const { courseId } = use(params);
  const [course, setCourse] = useState();

  useEffect(() => {
    params && GetCourse();
  }, [params]);

  const GetCourse = async () => {
    const res = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList?.courseId, courseId));

    setCourse(res[0]);
    console.log(res[0]);
  };

  return (
    <div>
      <Header />
      <div className="px-10 p-10 md:px-20 lg:px-44">
        <CourseBasicInfo course={course} edit={false} />

        <CourseDetail course={course} />

        <ChapterList course={course} edit={false} />
      </div>
    </div>
  );
};

export default Course;
