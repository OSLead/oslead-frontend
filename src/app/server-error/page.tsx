"use client";
import NavBar from "@/components/Navbar/page";
import React from "react";
import { FaGithub } from "react-icons/fa";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#0D0F16] flex flex-col justify-center items-center text-white p-4">
      <NavBar />
      <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-4 text-center">
        Important Points to Consider before Logging in
      </h1>
      <div className="text-base sm:text-lg lg:text-xl mb-6 text-center">
        <p className="mb-2">
          1. Your email address must be public on your GitHub account.
        </p>
        <p>2. Your name must be provided on your GitHub account.</p>
      </div>
      <a
        className="bg-blue-700 hover:bg-black text-white font-bold py-2 px-4 rounded flex items-center"
        href="/usertype"
      >
        <FaGithub size={24} className="mr-2" />
        <span>Join with GitHub!</span>
      </a>
    </div>
  );
};

export default Page;
