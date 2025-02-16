"use client";

import { useSubscription } from "@/app/_context/SubscriptionContext";
import { useUserCourseList } from "@/app/_context/UserCourseListContext";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useContext } from "react";

function AddCourse() {
  const { user } = useUser();
  const { userCourseList, setUserCourseList } = useUserCourseList();
  const { isActive } = useSubscription();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl mb-2">
          Hello, <span className="font-bold">{user?.fullName}</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Create new course with AI, Share with friends and Earn from it.
        </p>
      </div>
      <Link
        href={
          !isActive
            ? userCourseList?.length >= 5
              ? "/dashboard/upgrade"
              : "/create-course"
            : "/create-course"
        }
      >
        <Button>+ Create AI Course</Button>
      </Link>
    </div>
  );
}

export default AddCourse;
