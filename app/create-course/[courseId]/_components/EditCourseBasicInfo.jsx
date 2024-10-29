"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HiPencilSquare } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { db } from "@/config/db";
import { CourseList } from "@/config/schema";
import { eq } from "drizzle-orm";

const EditCourseBasicInfo = ({ course, refreshData }) => {
  const [name, setName] = useState();
  const [description, setDescription] = useState();

  useEffect(() => {
    setName(course?.courseOutput?.course?.name);
    setDescription(course?.courseOutput?.course?.description);
  }, [course]);

  const onUpdateHandler = async () => {
    course.courseOutput.course.name = name;
    course.courseOutput.course.description = description;

    const result = await db
      .update(CourseList)
      .set({
        courseOutput: course?.courseOutput,
      })
      .where(eq(CourseList?.id, course?.id))
      .returning({ id: CourseList.id });

    refreshData(true);
    // console.log(result);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <HiPencilSquare />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Course Title & Description</DialogTitle>
          <DialogDescription>
            <div className="mt-3">
              <label htmlFor="title">Course Title</label>
              <Input
                id="title"
                defaultValue={course?.courseOutput?.course?.name}
                onChange={(e) => setName(e?.target.value)}
              />
            </div>
            <div className="mt-2">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                defaultValue={course?.courseOutput?.course?.description}
                className="h-40"
                onChange={(e) => setDescription(e?.target.value)}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button onClick={onUpdateHandler}>Update</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseBasicInfo;
