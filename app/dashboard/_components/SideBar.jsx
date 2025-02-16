"use client";

import { useSubscription } from "@/app/_context/SubscriptionContext";
import { useUserCourseList } from "@/app/_context/UserCourseListContext";
import { Progress } from "@/components/ui/progress";
import { BookKey } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";
import {
  HiOutlineHome,
  HiOutlinePower,
  HiOutlineShieldCheck,
  HiOutlineSquare3Stack3D,
} from "react-icons/hi2";

const SideBar = () => {
  const { userCourseList } = useUserCourseList();
  const { isActive } = useSubscription();

  const Menu = [
    {
      id: 1,
      name: "Home",
      icon: <HiOutlineHome />,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Explore",
      icon: <HiOutlineSquare3Stack3D />,
      path: "/dashboard/explore",
    },
    {
      id: 3,
      name: "Upgrade",
      icon: <HiOutlineShieldCheck />,
      path: "/dashboard/upgrade",
    },
    {
      id: 4,
      name: "Logout",
      icon: <HiOutlinePower />,
      path: "/dashboard/logout",
    },
  ];

  const path = usePathname();

  return (
    <div className="fixed h-full md:w-64 p-5 shadow-md bg-white dark:bg-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <BookKey className="w-7 h-7 text-primary dark:text-white" />
        <span className="text-2xl font-[700] text-gray-700 dark:text-gray-200">
          LearnQuest
        </span>
      </div>
      <hr className="my-5 border-gray-300 dark:border-gray-600" />

      <ul>
        {Menu.map((item, index) => (
          <Link key={index} href={item.path}>
            <div
              className={`flex items-center gap-2 text-gray-600 p-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg mb-3 dark:text-gray-300 dark:hover:bg-gray-700 ${
                item.path === path &&
                "bg-gray-100 text-black dark:bg-gray-700 dark:text-white"
              }`}
            >
              <div className="text-2xl">{item.icon}</div>
              <h2>{item.name}</h2>
            </div>
          </Link>
        ))}
      </ul>

      <div className="absolute bottom-10 w-[80%]">
        {isActive ? (
          <>
            <h2 className="text-primary text-lg">Premium Member</h2>
            <p className="text-gray-600 text-sm">
              You have access to all features
            </p>
          </>
        ) : (
          <>
            <Progress value={(userCourseList?.length / 5) * 100} />
            <h2 className="text-sm my-2 mt-5 text-gray-700 dark:text-gray-300">
              {userCourseList?.length} Out of 5 Courses created
            </h2>
            <h2 className="text-xs text-gray-500 dark:text-gray-400">
              Upgrade your plan for unlimited course generation
            </h2>
          </>
        )}
      </div>
    </div>
  );
};

export default SideBar;
