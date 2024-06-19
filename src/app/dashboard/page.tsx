"use client";
import NavBar from "@/components/Navbar/page";
import Sidebar from "@/components/Sidebar/page";
import React from "react";

const page = () => {
  return (
    <>
      <div data-theme="dark" className="h-screen">
        <NavBar />
        <Sidebar />
      </div>
    </>
  );
};

export default page;
