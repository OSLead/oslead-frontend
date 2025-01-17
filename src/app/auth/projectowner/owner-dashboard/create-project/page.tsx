"use client";
import React, { useEffect, useState } from "react";
import NavBar from "@/components/Navbar/page";
import { getCookie } from "cookies-next";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import { RingLoader } from "react-spinners"; // Import RingLoader for loading animations
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

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
  const [githubRepoLink, setGithubRepoLink] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true); // State for loading projects
  const [loadingSubmit, setLoadingSubmit] = useState(false); // State for loading form submission
  const [loadingDelete, setLoadingDelete] = useState(false); // State for loading project deletion
  const [showModal, setShowModal] = useState(false); // State for showing the delete confirmation modal
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null); // State for the project to delete
  const token = getCookie("x-access-token");

  const fetchProjects = async () => {
    setLoadingProjects(true);

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
        "https://oslead-backend.vercel.app/api/projects/get-published-projects",
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

  useEffect(() => {
    if (token) {
      fetchProjects();
    } else {
      toast.error("Please login to view projects!");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoadingSubmit(true);

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
        "https://oslead-backend.vercel.app/api/projects/create-project",
        {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        }
      );

      const data = await response.text();

      if (response.ok) {
        toast.success("Project added successfully!");
        setGithubRepoLink(""); // Clear input field on success
        // Update the project list
        setProjects([...projects, JSON.parse(data)]);
        // Refresh the page after a delay
        setTimeout(() => {
          fetchProjects();
        }, 2000); // 2-second delay
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

  const handleDelete = (project: Project) => {
    setProjectToDelete(project);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      setLoadingDelete(true);

      const headersList = {
        Accept: "/",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const bodyContent = JSON.stringify({
        token: token,
        id: projectToDelete._id,
      });

      try {
        const response = await fetch(
          "https://oslead-backend.vercel.app/api/projects/delete-project",
          {
            method: "POST",
            body: bodyContent,
            headers: headersList,
          }
        );

        if (response.ok) {
          toast.success("Project deleted successfully!");
          fetchProjects(); // Refresh the project list
        } else {
          toast.error("Failed to delete project!");
        }
      } catch (error) {
        toast.error("Failed to delete project!");
        console.error("Error:", error);
      } finally {
        setLoadingDelete(false);
        setShowModal(false);
        setProjectToDelete(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <div className="mt-10 container mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none text-white focus:ring-2 focus:ring-blue-600"
                value={githubRepoLink}
                onChange={(e) => setGithubRepoLink(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition duration-300"
              disabled={loadingSubmit}
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mt-8"
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
                  <div className="flex items-center p-4 sm:p-6">
                    <Image
                      src={project.projectDetails?.owner?.avatar_url}
                      alt="Owner Avatar"
                      height={70}
                      width={70}
                      className="rounded-full mr-4"
                    />
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold text-white">
                        {project.projectDetails?.name}
                      </h2>
                      <p className="text-gray-400">
                        Owner: {project.projectDetails?.owner?.login}
                      </p>
                      <p className="text-gray-400 mt-2">
                        {project.projectDetails?.description ||
                          "No description available"}
                      </p>
                      <p className="text-gray-400 mt-1">
                        Language: {project.projectDetails?.language}
                      </p>
                      <div className="flex flex-col sm:flex-row justify-between mt-4">
                        <a
                          href={project.projectDetails?.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mb-2 sm:mb-0 block bg-blue-600 hover:bg-blue-700 text-white text-center p-2 rounded-lg transition duration-300"
                        >
                          View Repository
                        </a>
                        <button
                          onClick={() => handleDelete(project)}
                          className="block bg-red-600 hover:bg-orange-500 text-white text-center p-2 rounded-lg transition duration-300"
                          disabled={loadingDelete}
                        >
                          {loadingDelete &&
                          projectToDelete?._id === project._id ? (
                            <RingLoader
                              color={"#ffffff"}
                              loading={loadingDelete}
                              size={24}
                            />
                          ) : (
                            "Delete Repo"
                          )}
                        </button>
                      </div>
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

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">
              Are you sure you want to delete this project?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300"
              >
                {loadingDelete ? (
                  <RingLoader
                    color={"#ffffff"}
                    loading={loadingDelete}
                    size={24}
                  />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
