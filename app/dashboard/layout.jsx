"use client";

import React, { useState, useEffect } from "react";
import SideBar from "./_components/SideBar";
import Header from "./_components/Header";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.isLoaded && !user?.isSignedIn) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div>
      <div className="md:w-64 hidden md:block">
        <SideBar />
      </div>
      <div className="md:ml-64">
        <Header />
        <div className="p-10">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
