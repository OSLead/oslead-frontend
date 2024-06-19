"use client";
import React, { useState } from "react";
import NavBar from "@/components/Navbar/page";
import { getCookie } from "cookies-next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [githubPullLink, setGithubPullLink] = useState("");
  const token = getCookie("x-access-token");
  const [difficulty, setDifficulty] = useState("");
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let headersList = {
      Accept: "/",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const bodyContent = JSON.stringify({
      token: token,
      pullUrl: githubPullLink,
      difficulty: difficulty.toUpperCase(),
    });

    try {
      const response = await fetch(
        "https://oslead-backend.onrender.com/api/projects/analyze-pull-points",
        {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        }
      );

      const data = await response.text();
      console.log(data);

      if (response.status === 200) {
        toast.success("Project added successfully !");
      } else {
        toast.error("Failed to add project !");
        console.log("Error:", data);
      }
    } catch (error) {
      toast.error("Failed to add project !");
      console.error("Error:", error);
    }
  };
  return (
    <div className="h-screen bg-[#0D0F16]">
      <NavBar />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Assign Points </h1>
            <p className="py-6">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Perferendis quo unde ipsum labore quia dolorum possimus eligendi
              dolorem? Dolor architecto nihil libero, aut ipsa saepe placeat
              possimus molestiae mollitia asperiores voluptate molestias
              voluptas eos animi iusto repellendus! Aliquid pariatur ex minima
              voluptatum culpa, earum ratione alias maxime nulla dolores fugit.
            </p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Pull Url</span>
                </label>

                <input
                  type="url"
                  placeholder="Eg : https://github.com/PandaAnshuman/Recipe_Finder/pull/1"
                  className="input input-bordered"
                  value={githubPullLink}
                  onChange={(e) => setGithubPullLink(e.target.value)}
                  required
                />
                <label className="block text-gray-400 mb-2">Difficulty</label>
                <select
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  required
                >
                  <option disabled value="">
                    Choose Issue difficulty
                  </option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Assign Points
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Page;
