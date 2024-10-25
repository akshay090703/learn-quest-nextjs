import { UserButton } from "@clerk/nextjs";
import { BookKey } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center p-5 shadow-sm">
      <BookKey className="w-10 h-10 text-primary" />
      <UserButton />
    </div>
  );
};

export default Header;
