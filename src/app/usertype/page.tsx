/* eslint-disable @next/next/no-img-element */
"use client";
import NavBar from "@/components/Navbar/page";
import Link from "next/link";
import React from "react";


const Page = () => {
  return (
    <div className="h-screen bg-[#0D0F16] flex flex-col justify-center items-center">
      <NavBar />
      <div className="mt-10 flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="card w-full md:w-96 glass mx-4 transform transition duration-300 hover:scale-105 hover:shadow-2xl border border-yellow-500 rounded-xl bg-opacity-10 backdrop-blur-lg drop-shadow-xl">
          <figure>
            <img
              src="/Contributor_login.png"
              alt="Life hack"
              className="w-full h-48 object-cover rounded-t-xl"
            />
          </figure>
          <div className="card-body p-4">
            <h2 className="card-title text-xl font-bold mb-2">Contributor</h2>
            <p className="text-sm text-white">
               Login through your Github Account and make sure Your (Github Name, Github Email) is public.
            </p>
            <div className="mt-4 flex justify-end">
              <Link
                href={"https://oslead-backend.onrender.com/api/auth/github"}
                className="btn btn-info text-white"
              >
                Login as Contributor!
              </Link>
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div className="card w-full md:w-96 glass mx-4 transform transition duration-300 hover:scale-105 hover:shadow-2xl border border-yellow-500 rounded-xl bg-opacity-10 backdrop-blur-lg drop-shadow-xl">
          <figure>
            <img
              src="/projectadmin_login.png"
              alt="projectOwner"
              className="w-full h-48 object-cover rounded-t-xl"
            />
          </figure>
          <div className="card-body p-4">
            <h2 className="card-title text-xl font-bold mb-2">Project Admins</h2>
            <p className="text-sm text-white">
               Login through your Github Account and make sure Your (Github Name, Github Email) is public.
            </p>
            <div className="mt-4 flex justify-end">
              <Link
                href={
                  "https://oslead-backend.onrender.com/api/maintainer/auth/github"
                }
                className="btn btn-info text-white"
              >
                Login as PA!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
