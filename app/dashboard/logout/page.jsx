"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Logout = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    handleLogout();
  }, []);

  const handleLogout = async () => {
    await signOut();

    router.replace("/");
  };

  return (
    <div className="flex justify-center items-center">
      <h1 className="text-xl text-gray-800 dark:text-gray-200">
        Logging You Out....
      </h1>
    </div>
  );
};

export default Logout;
