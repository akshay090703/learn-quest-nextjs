import Image from "next/image";
import React from "react";
import { HiMiniEllipsisVertical, HiOutlineBookOpen } from "react-icons/hi2";
import DropdownOption from "./DropdownOption";
import { db } from "@/config/db";
import { CourseList } from "@/config/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

function CourseCard({ course, refreshData }) {
  const handleOnDelete = async () => {
    const res = await db
      .delete(CourseList)
      .where(eq(CourseList.id, course?.id))
      .returning({ id: CourseList?.id });

    if (res) {
      refreshData();
    }
  };

  return (
    <div className="shadow-sm rounded-lg border p-2 hover:border-primary cursor-pointer mt-4">
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
        <h2 className="font-medium text-lg flex justify-between items-center">
          {course?.courseOutput?.course?.name}
          <DropdownOption handleOnDelete={() => handleOnDelete()}>
            <HiMiniEllipsisVertical />
          </DropdownOption>
        </h2>
        <p className="text-sm text-gray-400 my-1">{course?.category}</p>

        <div className="flex items-center justify-between ">
          <h2 className="flex gap-2 items-center p-1 bg-purple-50 text-primary rounded-sm text-sm">
            <HiOutlineBookOpen />
            {course?.courseOutput?.course?.noOfChapters} Chapters
          </h2>
          <h2 className="text-sm bg-purple-50 text-primary p-1 rounded-sm">
            {course?.level}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
