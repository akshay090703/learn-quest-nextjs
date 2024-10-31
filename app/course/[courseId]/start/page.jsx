"use client";

import { db } from "@/config/db";
import { Chapters, CourseList } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import React, { use, useEffect, useState } from "react";
import ChapterListCard from "./_components/ChapterListCard";
import ChapterContent from "./_components/ChapterContent";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";

const CourseStart = ({ params }) => {
  const { courseId } = use(params);
  const [course, setCourse] = useState();
  const [selectedChapter, setSelectedChapter] = useState();
  const [chapterContent, setChapterContent] = useState();
  const router = useRouter();

  useEffect(() => {
    params && getCourse();
  }, [params]);

  //   Used to get the course info by using the course Id
  const getCourse = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList?.courseId, courseId));

    console.log(result[0]);
    setCourse(result[0]);
  };

  const getSelectedChapterContent = async (chapterId) => {
    const res = await db
      .select()
      .from(Chapters)
      .where(
        and(
          eq(Chapters.chapterId, chapterId),
          eq(Chapters.courseId, course?.courseId)
        )
      );

    console.log(res[0]);
    setChapterContent(res[0]);
  };

  return (
    <div>
      {/* Chapter list Side Bar */}
      <div className="fixed md:w-72 hidden md:block h-screen border-r shadow-sm">
        <h2 className="font-medium text-lg bg-primary p-4 text-white">
          {course?.courseOutput?.course?.name}
        </h2>

        <div className="">
          {course?.courseOutput?.course?.chapters.map((chapter, index) => (
            <div
              className={`cursor-pointer hover:bg-purple-50 ${
                selectedChapter?.name == chapter?.name && "bg-purple-100"
              }`}
              key={index}
              onClick={() => {
                setSelectedChapter(chapter);
                getSelectedChapterContent(index);
              }}
            >
              <ChapterListCard chapter={chapter} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* Content Div */}
      {chapterContent ? (
        <div className="md:ml-72">
          <ChapterContent chapter={selectedChapter} content={chapterContent} />
        </div>
      ) : (
        <div className="md:ml-72 p-10">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex gap-1 text-primary hover:underline mb-4"
          >
            <IoMdArrowRoundBack className="text-primary text-2xl" /> Back
          </button>
          <h1 className="text-center text-2xl">
            Access the course using the side bar
          </h1>
        </div>
      )}
    </div>
  );
};

export default CourseStart;
