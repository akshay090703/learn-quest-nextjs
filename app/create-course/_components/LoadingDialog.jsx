"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { useTheme } from "next-themes";

const LoadingDialog = ({ loading }) => {
  const { theme } = useTheme(); // Get the current theme

  // Determine the image source based on the theme
  const imageSrc = theme === "dark" ? "/dark-loader.png" : "/rocket-loader.gif";

  return (
    <AlertDialog open={loading}>
      <AlertDialogContent className="dark:bg-background-dark">
        <AlertDialogHeader>
          <AlertDialogTitle className="dark:text-text-dark"></AlertDialogTitle>
          <AlertDialogDescription className="dark:text-muted-foreground-dark">
            <div className="flex flex-col items-center py-5">
              <Image
                src={imageSrc} // Use the determined image source
                width={theme === "dark" ? 90 : 100}
                height={theme === "dark" ? 90 : 100}
                alt="Loader Image"
              />
              <h2 className="dark:text-text-dark text-lg mt-3">
                Please Wait... Ai is working on your course
              </h2>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoadingDialog;
