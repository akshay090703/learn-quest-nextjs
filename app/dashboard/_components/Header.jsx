import { ModeToggle } from "@/components/toggle-mode";
import { UserButton } from "@clerk/nextjs";
import { BookKey } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center p-5 shadow-sm dark:bg-gray-800">
      <BookKey className="w-10 h-10 text-primary dark:text-white" />

      <div className="flex gap-4">
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
};

export default Header;
