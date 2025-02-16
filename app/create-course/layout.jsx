"use client";

import React, { useState, useEffect, useContext } from "react";
import Header from "../dashboard/_components/Header";
import { UserInputContext } from "../_context/UserInputContext";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useUserCourseList } from "../_context/UserCourseListContext";
import toast from "react-hot-toast";
import { useSubscription } from "../_context/SubscriptionContext";

const CreateCourseLayout = ({ children }) => {
  const [userCourseInput, setUserCourseInput] = useState([]);
  const user = useUser();
  const router = useRouter();
  const { isActive, loading: subscriptionLoading } = useSubscription();
  const { userCourseList, loading } = useUserCourseList();

  useEffect(() => {
    if (user?.isLoaded && !user?.isSignedIn) {
      toast.error("Please login to continue");
      router.replace("/");
    }

    if (
      !loading &&
      !subscriptionLoading &&
      !isActive &&
      userCourseList.length >= 5
    ) {
      toast.error("Please buy a subscription");
      router.replace("/dashboard/upgrade");
    }
  }, [user, router, loading, subscriptionLoading]);

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
