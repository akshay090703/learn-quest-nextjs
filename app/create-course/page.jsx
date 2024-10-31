"use client";

import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import {
  HiClipboardDocumentCheck,
  HiLightBulb,
  HiMiniSquares2X2,
} from "react-icons/hi2";
import SelectCategory from "./_components/SelectCategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOptions from "./_components/SelectOptions";
import { UserInputContext } from "../_context/UserInputContext";
import { AiGenerateCourseLayout } from "@/config/AiModel";
import LoadingDialog from "./_components/LoadingDialog";
import { db } from "@/config/db";
import { CourseList } from "@/config/schema";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const CreateCourse = () => {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  // useEffect(() => {
  //   console.log(userCourseInput);
  // }, [userCourseInput]);

  // Used to check if the next button should be enabled or not
  const checkStatus = () => {
    if (userCourseInput?.length == 0) {
      return true;
    }

    if (
      activeIndex == 0 &&
      (userCourseInput?.category?.length == 0 ||
        userCourseInput?.category == undefined)
    ) {
      return true;
    } else if (
      activeIndex == 1 &&
      (userCourseInput?.topic?.length == 0 ||
        userCourseInput?.topic == undefined)
    ) {
      return true;
    } else if (
      activeIndex == 2 &&
      (userCourseInput?.level == undefined ||
        userCourseInput?.duration == undefined ||
        userCourseInput?.displayVideo == undefined ||
        userCourseInput?.noOfChapters == undefined ||
        userCourseInput?.noOfChapters?.length == 0 ||
        typeof parseInt(userCourseInput?.noOfChapters) != "number" ||
        parseInt(userCourseInput?.noOfChapters) <= 0 ||
        parseInt(userCourseInput?.noOfChapters) > 10)
    ) {
      return true;
    }

    return false;
  };

  const GenerateCourseLayout = async () => {
    setLoading(true);

    const PROMPT = `Generate A Course Tutorial on following details with field as Course Name, Description, Along with chapter name, about, Duration:
Category: ${userCourseInput?.category}, Topic: ${userCourseInput?.topic}, Level: ${userCourseInput?.level}, Duration: ${userCourseInput?.duration}, NoOfChapters: ${userCourseInput?.noOfChapters}. in JSON format
return only the json response, so that i can use it in my webapp
The json format should be like the following:
{course: 1. name 2. description 3. chapters -> (a) name (b) about (c) duration 4. category 5. topic 6. level 7. duration 8. noOfChapters }`;

    console.log(PROMPT);
    const result = await AiGenerateCourseLayout.sendMessage(PROMPT);

    console.log(JSON.parse(result.response?.text()));
    setLoading(false);

    saveCourseLayoutInDb(JSON.parse(result.response?.text()));
  };

  const saveCourseLayoutInDb = async (courseLayout) => {
    setLoading(true);
    const id = uuid4();

    const result = await db.insert(CourseList).values({
      courseId: id,
      name: userCourseInput?.topic,
      level: userCourseInput?.level,
      category: userCourseInput?.category,
      courseOutput: courseLayout,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      username: user?.fullName,
      userProfileImage: user?.imageUrl,
      includeVideo: userCourseInput?.displayVideo,
    });

    setLoading(false);
    router.replace("/create-course/" + id);
  };

  const StepperOptions = [
    {
      id: 1,
      name: "Category",
      icon: <HiMiniSquares2X2 />,
    },
    {
      id: 2,
      name: "Topic & Desc.",
      icon: <HiLightBulb />,
    },
    {
      id: 1,
      name: "Options",
      icon: <HiClipboardDocumentCheck />,
    },
  ];

  return (
    <div>
      {/* Stepper */}
      <div className="flex flex-col justify-center items-center mt-10">
        <h2 className="text-2xl text-primary font-medium">Create Course</h2>

        <div className="flex mt-10">
          {StepperOptions.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center w-[50px] md:w-[100px]">
                <div
                  className={`bg-gray-200 p-3 rounded-full text-white ${
                    activeIndex >= index && "bg-primary"
                  }`}
                >
                  {item.icon}
                </div>
                <h2 className="hidden md:block md:text-sm">{item.name}</h2>
              </div>

              {index != StepperOptions?.length - 1 && (
                <div
                  className={`h-1 w-[50px] md:w-[100px] rounded-full lg:w-[170px] bg-gray-300 ${
                    activeIndex - 1 >= index && "bg-primary"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-10 md:px-20 lg:px-44 mt-10">
        {/* Component */}
        {activeIndex == 0 ? (
          <SelectCategory />
        ) : activeIndex == 1 ? (
          <TopicDescription />
        ) : (
          <SelectOptions />
        )}

        {/* Next Previous Button */}
        <div className="flex justify-between mt-10">
          <Button
            disabled={activeIndex == 0}
            onClick={() => setActiveIndex(activeIndex - 1)}
            variant="outline"
          >
            Previous
          </Button>
          {activeIndex < 2 && (
            <Button
              onClick={() => setActiveIndex(activeIndex + 1)}
              disabled={checkStatus()}
            >
              Next
            </Button>
          )}
          {activeIndex == 2 && (
            <Button
              disabled={checkStatus()}
              onClick={() => GenerateCourseLayout()}
            >
              Generate Course Layout
            </Button>
          )}
        </div>
      </div>
      <LoadingDialog loading={loading} />
    </div>
  );
};

export default CreateCourse;
