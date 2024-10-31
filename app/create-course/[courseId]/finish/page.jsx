"use client";

import { db } from "@/config/db";
import { CourseList } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import React, { useState, use, useEffect } from "react";
import CourseBasicInfo from "../_components/CourseBasicInfo";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import toast from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";

function FinishScreen({ params }) {
  const { user } = useUser();
  const { courseId } = use(params);
  const [course, setCourse] = useState([]);
  const router = useRouter();

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
    <div className="px-10 md:px-20 lg:px-44 my-7">
      {/* Back Button */}
      <button
        onClick={() => router.replace("/dashboard")}
        className="flex gap-1 text-primary hover:underline mb-4"
      >
        <IoMdArrowRoundBack className="text-primary text-2xl" /> Back To
        Dashboard
      </button>
      <h2 className="text-center font-bold text-2xl my-3 text-primary">
        Congrats! Your course is Ready
      </h2>

      <CourseBasicInfo course={course} refreshData={() => console.log()} />

      <h2 className="mt-4">Course URL: </h2>
      <h2 className="text-center text-gray-400 border p-2 rounded flex gap-5 items-center">
        {/* {`${process.env.NEXT_PUBLIC_HOST_NAME}/course/view/${course?.courseId}`}{" "} */}
        {`${process.env.NEXT_PUBLIC_HOST_NAME}/course/${course?.courseId}`}{" "}
        <HiOutlineClipboardDocumentCheck
          className="h-5 w-5 cursor-pointer"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_HOST_NAME}/course/${course?.courseId}`
              );
              toast.success("Link Copied!");
            } catch (error) {
              toast.error("Could not copy!");
            }
          }}
        />
      </h2>
    </div>
  );
}

export default FinishScreen;
