"use client";
import React, { useState } from "react";
import NavBar from "@/components/Navbar/page";
import { getCookie } from "cookies-next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const Page = () => {
  const [githubPullLink, setGithubPullLink] = useState("");
  const token = getCookie("x-access-token");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true); // Start loading
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
        toast.success("Points assigned successfully !");
      } else {
        toast.error("Failed to assign point !");
        console.log("Error:", data);
      }
    } catch (error) {
      toast.error("Failed to assign points !");
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="h-screen bg-[#0D0F16] text-white">
      <NavBar />
      <div className="hero min-h-screen flex items-center justify-center">
        <div className="hero-content flex flex-col lg:flex-row-reverse p-8">
          <div className="text-center lg:text-left mb-8 lg:mb-0 lg:w-1/2">
            <h1 className="text-5xl font-bold text-white">Assign Points</h1>
            <p className="py-6 text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Perferendis quo unde ipsum labore quia dolorum possimus eligendi
              dolorem? Dolor architecto nihil libero, aut ipsa saepe placeat
              possimus molestiae mollitia asperiores voluptate molestias
              voluptas eos animi iusto repellendus! Aliquid pariatur ex minima
              voluptatum culpa, earum ratione alias maxime nulla dolores fugit.
            </p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-gray-800 rounded-lg p-6">
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label mb-2">
                  <span className="label-text text-gray-400">Pull URL</span>
                </label>
                <input
                  type="url"
                  placeholder="Eg: https://github.com/PandaAnshuman/Recipe_Finder/pull/1"
                  className="input input-bordered w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={githubPullLink}
                  onChange={(e) => setGithubPullLink(e.target.value)}
                  required
                />
              </div>
              <div className="form-control mb-6">
                <label className="label mb-2">
                  <span className="label-text text-gray-400">Difficulty</span>
                </label>
                <select
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  required
                >
                  <option disabled value="">
                    Choose Issue Difficulty
                  </option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
              <div className="form-control">
                <button
                  type="submit"
                  className="text-white btn btn-primary w-full py-3 rounded-lg bg-blue-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    "Assign Points"
                  )}
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
        theme="dark"
      />
    </div>
  );
};

export default Page;
