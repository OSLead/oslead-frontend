"use client";
import React from "react";
import NavBar from "@/components/Navbar/page";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    // h-screen bg-[#0D0F16]
    <div className="h-full bg-[#0D0F16]">
      <NavBar />
      <div className="hero pt-20 ">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-white">
              Ready to Make Your Mark?
            </h1>
            <p className="py-6 text-xl text-white">
              Dive in and make your mark on the projects that matter to you.
              Every commit, every line of code, every idea shared—brings us
              closer to a more innovative and inclusive tech community.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 p-4">
        <div className="w-full sm:w-96 md:w-auto lg:w-96 xl:w-96">
          <div className="card w-100 glass border border-yellow-500 rounded-xl bg-opacity-10 backdrop-blur-lg drop-shadow-xl hover:shadow-2xl transform transition duration-300 hover:scale-105">
            <figure className="px-10 pt-10">
              <img
                src="/addProject.png"
                alt="Available Projects"
                className="w-full h-48 object-cover rounded-t-xl"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title text-white">Available Projects</h2>
              <p className="text-white">
                Discover a wide array of projects that need your expertise.
              </p>
              <div className="card-actions">
                <Link
                  href={"/contributor_index/available_projects"}
                  className="btn btn-info text-white"
                >
                  View Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-96 md:w-auto lg:w-96 xl:w-96">
          <div className="card w-100 glass border border-yellow-500 rounded-xl bg-opacity-10 backdrop-blur-lg drop-shadow-xl hover:shadow-2xl transform transition duration-300 hover:scale-105">
            <figure className="px-10 pt-10">
              <img
                src="/assignPoint.png"
                alt="Enrolled Projects"
                className="w-full h-48 object-cover rounded-t-xl"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title text-white">Enrolled Projects</h2>
              <p className="text-white">
                Keep track of the projects you’re actively contributing to.
              </p>
              <div className="card-actions">
                <Link
                  href={"/contributor_index/enrolled_projects"}
                  className="btn btn-info text-white"
                >
                  View Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
