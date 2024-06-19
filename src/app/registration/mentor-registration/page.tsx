"use client";
import React from "react";
import NavBar from "@/components/Navbar/page";
import MentorRegistration from "@/components/mentor-register/page";

const page = () => {
  return (
    <div className="h-screen bg-[#0D0F16]">
      <NavBar />
      <MentorRegistration />
    </div>
  );
};

export default page;
