"use client";
import React from "react";
import NavBar from "@/components/Navbar/page";
import RegistrationForm from "@/components/registration/page";
const page = () => {
  return (
    <div className="h-screen bg-[#0D0F16]">
      <NavBar />
      <RegistrationForm />
    </div>
  );
};

export default page;
