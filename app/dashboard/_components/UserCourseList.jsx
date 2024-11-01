"use client";

import { db } from "@/config/db";
import { CourseList } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import React, { useContext, useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { UserCourseListContext } from "@/app/_context/UserCourseListContext";

function UserCourseList() {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);
  const { setUserCourseList } = useContext(UserCourseListContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      getUserCourses();
    }
  }, [user]);

  const getUserCourses = async () => {
    setLoading(true);
    const result = await db
      .select()
      .from(CourseList)
      .where(
        eq(CourseList?.createdBy, user?.primaryEmailAddress?.emailAddress)
      );

    setCourseList(result);
    setUserCourseList(result);
    setLoading(false);
  };

  return (
    <div className="mt-10">
      <h2 className="font-medium text-xl text-gray-800 dark:text-gray-200">
        My AI Courses
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courseList.length > 0
          ? courseList.map((course, index) => (
              <CourseCard
                course={course}
                key={index}
                refreshData={getUserCourses}
              />
            ))
          : loading &&
            [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg h-[270px] mt-5"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default UserCourseList;
