"use client";

import { UserInputContext } from "@/app/_context/UserInputContext";
import CategoryList from "@/app/_shared/CategoryList";
import Image from "next/image";
import React, { useContext } from "react";

const SelectCategory = () => {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

  const handleCategoryChange = (category) => {
    setUserCourseInput((prev) => ({
      ...prev,
      category: category,
    }));
  };

  return (
    <div className="px-10 md:px-20">
      <h2 className="my-5 text-gray-800 dark:text-gray-200">
        Select the Course Category
      </h2>
      <div className="grid grid-cols-3 gap-10">
        {CategoryList.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col p-5 border items-center rounded-xl hover:border-primary hover:bg-blue-50 cursor-pointer ${
              userCourseInput?.category == item.name
                ? "border-primary bg-blue-50 dark:bg-blue-700 dark:border-blue-500"
                : "dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-blue-700"
            }`}
            onClick={() => handleCategoryChange(item.name)}
          >
            <Image
              src={item.icon}
              width={item.name == "Health" ? 90 : 60}
              height={item.name == "Health" ? 90 : 60}
              alt={item.name}
            />
            <h2 className="text-gray-800 dark:text-gray-200">{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectCategory;
