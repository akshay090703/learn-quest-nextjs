"use client";

import { Button } from "@/components/ui/button";
import { BookKey } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/toggle-mode";

function Header() {
  const router = useRouter();

  const onButtonClick = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex justify-between p-5 shadow-md bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <BookKey className="w-7 h-7 text-primary dark:text-gray-200" />
        <span className="text-2xl font-[700] text-gray-700 dark:text-gray-200">
          LearnQuest
        </span>
      </div>
      <div className="flex gap-4">
        <ModeToggle />
        <Button onClick={onButtonClick}>Get Started</Button>
      </div>
    </div>
  );
}

export default Header;
