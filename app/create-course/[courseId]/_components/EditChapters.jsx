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

const EditChapters = ({ course, index, refreshData }) => {
  const Chapters = course?.courseOutput?.course?.chapters;
  const [name, setName] = useState();
  const [about, setAbout] = useState();

  useEffect(() => {
    setName(Chapters[index].name);
    setAbout(Chapters[index].about);
  }, [course]);

  const onUpdateHandler = async () => {
    course.courseOutput.course.chapters[index].name = name;
    course.courseOutput.course.chapters[index].about = about;

    const result = await db
      .update(CourseList)
      .set({
        courseOutput: course?.courseOutput,
      })
      .where(eq(CourseList?.id, course?.id))
      .returning({ id: CourseList.id });

    // console.log(result);
    refreshData(true);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <HiPencilSquare />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Chapter</DialogTitle>
          <DialogDescription>
            <div className="mt-3">
              <label htmlFor="title">Course Title</label>
              <Input
                id="title"
                defaultValue={Chapters[index].name}
                onChange={(e) => setName(e?.target.value)}
              />
            </div>
            <div className="mt-2">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                defaultValue={Chapters[index].about}
                className="h-40"
                onChange={(e) => setAbout(e?.target.value)}
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

export default EditChapters;
