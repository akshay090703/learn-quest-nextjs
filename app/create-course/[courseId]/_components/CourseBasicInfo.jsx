"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { HiOutlinePuzzle } from "react-icons/hi";
import EditCourseBasicInfo from "./EditCourseBasicInfo";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import { db } from "@/config/db";
import { CourseList } from "@/config/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

const CourseBasicInfo = ({ course, refreshData, edit = true }) => {
  const [selectedFile, setSelectedFile] = useState();

  useEffect(() => {
    if (course) {
      setSelectedFile(course?.courseBanner);
    }
  }, [course]);

  // Selecting and Uploading photo to Firebase
  const onFileSelected = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(URL.createObjectURL(file));

    const fileName = Date.now() + ".jpg";
    const storageRef = ref(storage, "ai-course-banner/" + fileName);

    await uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log("Uploading File Completed");
      })
      .then((res) => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          console.log(downloadUrl);
          await db
            .update(CourseList)
            .set({
              courseBanner: downloadUrl,
            })
            .where(eq(CourseList.id, course?.id));
        });
      });
  };

  return (
    <div className="p-10 border rounded-xl shadow-sm mt-5 pb-2 bg-white dark:bg-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h2 className="font-bold text-3xl text-gray-800 dark:text-white">
            {course?.courseOutput?.course?.name}
            {"  "}
            <span className="text-xl">
              {edit && (
                <EditCourseBasicInfo
                  course={course}
                  refreshData={() => refreshData(true)}
                />
              )}
            </span>
          </h2>
          <p className="text-sm text-gray-400 mt-3 dark:text-gray-300">
            {course?.courseOutput?.course?.description}
          </p>
          <h2 className="font-medium mt-2 flex gap-2 items-center text-primary dark:text-primary-light">
            <HiOutlinePuzzle /> {course?.category}
          </h2>
          {!edit && (
            <Link href={"/course/" + course?.courseId + "/start"}>
              <Button className="w-full mt-10 mb-4">Start</Button>
            </Link>
          )}
        </div>
        <div>
          <label htmlFor="upload-file">
            <Image
              src={selectedFile ? selectedFile : "/image-placeholder.jpg"}
              width={300}
              height={300}
              className="w-full rounded-xl h-[240px] object-cover cursor-pointer"
              alt="upload image"
            />
          </label>
          {edit && (
            <input
              type="file"
              id="upload-file"
              className="opacity-0"
              onChange={onFileSelected}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseBasicInfo;
