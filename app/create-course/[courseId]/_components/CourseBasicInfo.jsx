import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { HiOutlinePuzzle } from "react-icons/hi";
import EditCourseBasicInfo from "./EditCourseBasicInfo";

const CourseBasicInfo = ({ course, refreshData }) => {
  return (
    <div className="p-10 border rounded-xl shadow-sm mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h2 className="font-bold text-3xl">
            {course?.courseOutput?.course?.name}
            {"  "}
            <span className="text-xl">
              <EditCourseBasicInfo
                course={course}
                refreshData={() => refreshData(true)}
              />
            </span>
          </h2>
          <p className="text-sm text-gray-400 mt-3">
            {course?.courseOutput?.course?.description}
          </p>
          <h2 className="font-medium mt-2 flex gap-2 items-center text-primary">
            <HiOutlinePuzzle /> {course?.category}
          </h2>
          <Button className="w-full mt-10">Start</Button>
        </div>
        <div>
          <Image
            src={"/image-placeholder.jpg"}
            width={300}
            height={300}
            className="w-full rounded-xl h-[240px] object-cover"
            alt="upload image"
          />
        </div>
      </div>
    </div>
  );
};

export default CourseBasicInfo;
