"use client";
import React from "react";
import AddCourse from "./_components/AddCourse";
import UserCourseList from "./_components/UserCourseList";

function Dashboard() {
  return (
    <div>
      <AddCourse />

      {/* Display List of courses */}
      <UserCourseList />
    </div>
  );
}

export default Dashboard;
