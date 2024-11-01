import Image from "next/image";
import React from "react";
import { HiMiniEllipsisVertical, HiOutlineBookOpen } from "react-icons/hi2";
import DropdownOption from "./DropdownOption";
import { db } from "@/config/db";
import { Chapters, CourseList } from "@/config/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import toast from "react-hot-toast";

function CourseCard({ course, refreshData, displayUser = false }) {
  const handleOnDelete = async () => {
    const res = await db
      .delete(CourseList)
      .where(eq(CourseList.id, course?.id))
      .returning({ id: CourseList?.id });

    const res1 = await db
      .delete(Chapters)
      .where(eq(Chapters.courseId, course.courseId))
      .returning({ courseId: Chapters?.courseId });

    if (res && res1) {
      toast.success("Successfully deleted!");
      refreshData();
    } else {
      toast.error("There was an error!");
    }
  };

  return (
    <div className="shadow-sm rounded-lg border p-2 hover:border-primary cursor-pointer mt-4 dark:bg-gray-800 dark:border-gray-700">
      <Link href={"/course/" + course?.courseId}>
        <Image
          src={course?.courseBanner}
          alt="Course Banner"
          width={300}
          height={200}
          className="w-full h-[200px] rounded-lg object-cover"
        />
      </Link>

      <div className="p-2">
        {!displayUser && (
          <h2 className="font-medium text-lg flex justify-between items-center dark:text-white">
            {course?.courseOutput?.course?.name}
            <DropdownOption handleOnDelete={() => handleOnDelete()}>
              <HiMiniEllipsisVertical />
            </DropdownOption>
          </h2>
        )}
        <p className="text-sm text-gray-400 my-1 dark:text-gray-300 ">
          {course?.category}
        </p>

        <div className="flex items-center justify-between">
          <h2 className="flex gap-2 items-center p-1 bg-purple-50 text-primary rounded-sm text-sm dark:bg-purple-900 dark:text-purple-50">
            <HiOutlineBookOpen />
            {course?.courseOutput?.course?.noOfChapters} Chapters
          </h2>
          <h2 className="text-sm bg-purple-50 text-primary p-1 rounded-sm dark:bg-purple-900 dark:text-purple-50">
            {course?.level}
          </h2>
        </div>

        {displayUser && (
          <div className="flex gap-2 items-center mt-2">
            <Image
              src={course?.userProfileImage}
              width={35}
              height={35}
              alt="user image"
              className="rounded-full"
            />
            <h2 className="text-sm dark:text-gray-300">{course?.createdBy}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseCard;
