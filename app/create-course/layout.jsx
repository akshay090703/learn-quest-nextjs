"use client";

import React, { useState, useEffect } from "react";
import Header from "../dashboard/_components/Header";
import { UserInputContext } from "../_context/UserInputContext";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const CreateCourseLayout = ({ children }) => {
  const [userCourseInput, setUserCourseInput] = useState([]);
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.isLoaded && !user?.isSignedIn) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div>
      <UserInputContext.Provider
        value={{ userCourseInput, setUserCourseInput }}
      >
        <>
          <Header />
          {children}
        </>
      </UserInputContext.Provider>
    </div>
  );
};

export default CreateCourseLayout;
