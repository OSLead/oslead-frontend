"use client";
import React, { useEffect, useState } from "react";
import NavBar from "@/components/Navbar/page";
import { getCookie } from "cookies-next";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import { RingLoader } from "react-spinners"; // Import RingLoader for loading animations
import "react-toastify/dist/ReactToastify.css";

interface Project {
  _id: string;
  projectDetails: {
    name: string;
    owner: {
      login: string;
      avatar_url: string;
    };
    html_url: string;
    description: string | null;
    language: string;
  };
  difficulty: string;
}

const Page = () => {
  const [difficulty, setDifficulty] = useState("");
  const [githubRepoLink, setGithubRepoLink] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true); // State for loading projects
  const [loadingSubmit, setLoadingSubmit] = useState(false); // State for loading form submission
  const token = getCookie("x-access-token");

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true); // Start loading animation

      try {
        const headersList = {
          Accept: "/",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          "Content-Type": "application/json",
        };

        const bodyContent = JSON.stringify({
          token: token,
        });

        const response = await fetch(
          "https://oslead-backend.onrender.com/api/projects/get-published-projects",
          {
            method: "POST",
            body: bodyContent,
            headers: headersList,
          }
        );

        const data: Project[] = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to fetch projects. Please try again.");
      } finally {
        setLoadingProjects(false); // Stop loading animation
      }
    };

    if (token) {
      fetchProjects();
    } else {
      toast.error("Please login to view projects!");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoadingSubmit(true); // Start loading animation

    const headersList = {
      Accept: "/",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const bodyContent = JSON.stringify({
      token: token,
      github_repo_link: githubRepoLink,
    });

    try {
      const response = await fetch(
        "https://oslead-backend.onrender.com/api/projects/create-project",
        {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        }
      );

      const data = await response.text();
      console.log(data);

      if (response.ok) {
        toast.success("Project added successfully!");
        setGithubRepoLink(""); // Clear input field on success
      } else {
        toast.error("Failed to add project!");
      }
    } catch (error) {
      toast.error("Failed to add project!");
      console.error("Error:", error);
    } finally {
      setLoadingSubmit(false); // Stop loading animation
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <div className="mt-10 container mx-auto py-12 px-4">
        <motion.div
          className="bg-gray-800 p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-white">
            Add Your Project
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="block text-gray-400 mb-2">Repository URL</label>
              <input
                type="url"
                placeholder="Enter repository URL"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none text-white"
                value={githubRepoLink}
                onChange={(e) => setGithubRepoLink(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition duration-300"
              disabled={loadingSubmit} // Disable button during loading
            >
              {loadingSubmit ? (
                <RingLoader
                  color={"#ffffff"}
                  loading={loadingSubmit}
                  size={24}
                />
              ) : (
                "Add Project"
              )}
            </button>
          </form>
        </motion.div>
        <h1 className="text-3xl font-bold mt-12 mb-6 text-center text-white">
          Published Projects
        </h1>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {loadingProjects ? (
            <div className="col-span-full flex justify-center items-center">
              <RingLoader
                color={"#ffffff"}
                loading={loadingProjects}
                size={150}
              />
            </div>
          ) : Array.isArray(projects) ? (
            projects.length === 0 ? (
              <p className="text-center col-span-full text-white">
                No projects added. Add projects to see them.
              </p>
            ) : (
              projects.map((project) => (
                <motion.div
                  key={project._id}
                  className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center p-6">
                    <img
                      src={project.projectDetails.owner.avatar_url}
                      alt="Owner Avatar"
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold text-white">
                        {project.projectDetails.name}
                      </h2>
                      <p className="text-gray-400">
                        Owner: {project.projectDetails.owner.login}
                      </p>
                      <p className="text-gray-400 mt-2">
                        {project.projectDetails.description ||
                          "No description available"}
                      </p>
                      <p className="text-gray-400 mt-1">
                        Language: {project.projectDetails.language}
                      </p>
                      <p className="text-gray-400 mt-1">
                        Difficulty: {project.difficulty}
                      </p>
                      <a
                        href={project.projectDetails.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-4 bg-blue-600 hover:bg-blue-700 text-white text-center p-2 rounded-lg transition duration-300"
                      >
                        View Repository
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            )
          ) : (
            <p className="text-center text-white">
              Error fetching projects. Please try again.
            </p>
          )}
        </motion.div>
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
