"use client";

import { db } from "@/config/db";
import { CourseList } from "@/config/schema";
import React, { useEffect, useState } from "react";
import CourseCard from "../_components/CourseCard";
import { Button } from "@/components/ui/button";

const Explore = () => {
  const [courseList, setCourseList] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    getAllCourses();
  }, [pageIndex]);

  const getAllCourses = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .limit(9)
      .offset(pageIndex * 9);

    setCourseList(result);
  };

  return (
    <div className="px-4">
      <h2 className="font-bold text-3xl text-gray-800 dark:text-gray-200">
        Explore More Courses
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Explore more projects built with AI by other users
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
        {courseList?.map((course, index) => (
          <div className="" key={index}>
            <CourseCard course={course} displayUser={true} />
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-5">
        <Button
          disabled={pageIndex === 0}
          onClick={() => setPageIndex(pageIndex - 1)}
        >
          Previous Page
        </Button>
        <Button onClick={() => setPageIndex(pageIndex + 1)}>Next Page</Button>
      </div>
    </div>
  );
};

export default Explore;
