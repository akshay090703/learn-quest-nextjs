"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { CourseList } from "@/config/schema";

export const UserCourseListContext = createContext();

export const UserCourseListProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [userCourseList, setUserCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserCourses = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      setLoading(true);
      const result = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.createdBy, user.primaryEmailAddress.emailAddress));

      setUserCourseList(result);
    } catch (error) {
      console.error("Error fetching user courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
      getUserCourses();
    }
  }, [isLoaded, user?.primaryEmailAddress?.emailAddress]);

  return (
    <UserCourseListContext.Provider
      value={{ userCourseList, setUserCourseList, getUserCourses, loading }}
    >
      {children}
    </UserCourseListContext.Provider>
  );
};

export const useUserCourseList = () => useContext(UserCourseListContext);
