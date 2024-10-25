import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  HiClipboardDocumentCheck,
  HiLightBulb,
  HiMiniSquares2X2,
} from "react-icons/hi2";

const CreateCourse = () => {
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

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {/* Stepper */}
      <div className="flex flex-col justify-center items-center mt-10">
        <h2 className="text-2xl text-primary font-medium">Create Course</h2>

        <div className="flex mt-10">
          {StepperOptions.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center w-[50px] md:w-[100px]">
                <div className="bg-gray-200 p-3 rounded-full text-white">
                  {item.icon}
                </div>
                <h2 className="hidden md:block md:text-sm">{item.name}</h2>
              </div>

              {index != StepperOptions?.length - 1 && (
                <div className="h-1 w-[50px] md:w-[100px] rounded-full lg:w-[170px] bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Component */}

      {/* Next Previous Button */}
      <div className="">
        <Button>Next</Button>
      </div>
    </div>
  );
};

export default CreateCourse;
