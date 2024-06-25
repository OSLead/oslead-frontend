/* eslint-disable @next/next/no-img-element */
"use client";
import NavBar from "@/components/Navbar/page";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="h-full h-screen bg-[#0D0F16] flex flex-col justify-center items-center">
      <NavBar />
      <div className="flex flex-col mt-10 md:flex-row justify-center items-center gap-4 ">
        {/* First Card */}
        <div className="card w-full md:w-96 glass mx-4">
          <figure>
            <img
              src="/addProject.png"
              alt="Create Add Project"
              className="w-full h-48 object-cover rounded-t"
            />
          </figure>
          <div className="card-body p-4">
            <h2 className="card-title text-xl font-bold mb-2 text-white">
             Create Add Project
            </h2>
            <p className="text-sm text-gray-300">
              Start a new project and manage its details effortlessly.
            </p>
            <div className="mt-4 flex justify-end">
              <Link
                href="/auth/projectowner/owner-dashboard/create-project"
                className="btn btn-info text-white"
              >
                Create Project
              </Link>
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div className="card w-full md:w-96 glass mx-4">
          <figure>
            <img
              src="/assignPoint.png"
              alt="Assign Points"
              className="w-full h-48 object-cover rounded-t"
            />
          </figure>
          <div className="card-body p-4">
            <h2 className="card-title text-xl font-bold mb-2 text-white">
              Assign Points
            </h2>
            <p className="text-sm text-gray-300">
              Reward contributors by assigning points to their contributions.
            </p>
            <div className="mt-4 flex justify-end">
              <Link
                href="/auth/projectowner/owner-dashboard/assign-points"
                className="btn btn-info text-white"
              >
                Assign Points
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
