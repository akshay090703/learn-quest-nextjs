"use client";

import { db } from "@/config/db";
import { Chapters, CourseList } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, use, useState } from "react";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";
import { Button } from "@/components/ui/button";
import { AiGenerateChapterContent } from "@/config/AiModel";
import LoadingDialog from "../_components/LoadingDialog";
import service from "@/config/service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CourseLayout = ({ params }) => {
  const { user } = useUser();
  const { courseId } = use(params);
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const GenerateChapterContent = () => {
    setLoading(true);
    const chapters = course?.courseOutput?.course?.chapters;

    chapters.forEach(async (chapter, index) => {
      const PROMPT = `Explain the concept in Detail on Topic: ${course?.name}, Chapter:${chapter?.name}, in JSON Format with list of array with field as title, explanation on given chapter in detail, Code Example(Code field in <precode> format) if applicable`;

      console.log(PROMPT);

      try {
        let videoId = "";

        // Generate Video URL
        service.getVideos(course?.name + ":" + chapter?.name).then((res) => {
          console.log(res);
          videoId = res[0]?.id?.videoId;
        });

        const result = await AiGenerateChapterContent.sendMessage(PROMPT);
        const content = JSON.parse(result.response?.text());

        // Save Chapter Content + Video URL
        await db.insert(Chapters).values({
          chapterId: index,
          courseId: course?.courseId,
          content: content,
          videoId: videoId,
        });

        await db
          .update(CourseList)
          .set({
            publish: true,
          })
          .where(and(eq(CourseList.courseId, courseId)));

        router.replace(`/create-course/${course?.courseId}/finish`);
      } catch (error) {
        console.log(error);
        toast.error("There was an error!");
      }

      setLoading(false);
    });
  };

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44 bg-background text-foreground dark:bg-background dark:text-foreground">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>

      <LoadingDialog loading={loading} />

      {/* Basic Info */}
      <CourseBasicInfo course={course} refreshData={() => getCourse()} />

      {/* Course Details */}
      <CourseDetail course={course} />

      {/* List of Lesson */}
      <ChapterList course={course} refreshData={() => getCourse()} />

      <Button onClick={GenerateChapterContent} className="my-10 ">
        Generate Course Content
      </Button>
    </div>
  );
};

export default CourseLayout;
