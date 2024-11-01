"use client";

import { UserInputContext } from "@/app/_context/UserInputContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useContext } from "react";

const TopicDescription = () => {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

  const handleInputChange = (fieldName, value) => {
    setUserCourseInput((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <div className="mx-20 lg:mx-44">
      {/* Input Topic */}
      <div className="mt-5">
        <label htmlFor="topic" className="text-gray-800 dark:text-gray-200">
          🤔 Write the topic for which you want to generate a course (e.g.,
          Python, Yoga, etc.):{" "}
        </label>
        <Input
          id="topic"
          className="p-2 mt-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          placeholder="Topic"
          defaultValue={userCourseInput?.topic}
          onChange={(e) => handleInputChange("topic", e.target.value)}
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="description"
          className="text-gray-800 dark:text-gray-200"
        >
          🧠 Tell us more about your course, what you want to include in the
          course (Optional)
        </label>
        <Textarea
          id="description"
          placeholder="About your course"
          className="p-2 mt-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          onChange={(e) => handleInputChange("description", e.target.value)}
          defaultValue={userCourseInput?.description}
        />
      </div>
    </div>
  );
};

export default TopicDescription;
