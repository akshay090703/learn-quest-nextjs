import React from "react";
import { HiOutlineClock } from "react-icons/hi2";

const ChapterListCard = ({ chapter, index }) => {
  return (
    <div className="grid grid-cols-5 p-4 items-center border-b dark:border-gray-600">
      <div>
        <h2 className="p-1 bg-primary text-white rounded-full w-8 h-8 text-center">
          {index + 1}
        </h2>
      </div>

      <div className="col-span-4">
        <h2 className="font-medium text-foreground dark:text-gray-200">
          {chapter?.name}
        </h2>
        <h2 className="flex items-center gap-1 text-sm text-primary">
          <HiOutlineClock />
          {chapter?.duration}
        </h2>
      </div>
    </div>
  );
};

export default ChapterListCard;
