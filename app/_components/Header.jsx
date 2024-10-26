"use client";

import { Button } from "@/components/ui/button";
import { BookKey } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

function Header() {
  const router = useRouter();

  const onButtonClick = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex justify-between p-5 shadow-md">
      <div className="flex items-center gap-2">
        <BookKey className="w-7 h-7 text-primary" />
        <span className="text-2xl font-[700] text-gray-700 ">LearnQuest</span>
      </div>
      <Button onClick={onButtonClick}>Get Started</Button>
    </div>
  );
}

export default Header;
