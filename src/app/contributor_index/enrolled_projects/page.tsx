"use client";
import NavBar from "@/components/Navbar/page";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

// Define the interface for the project data
interface Project {
  projectId: string;
  projectName: string;
  projectUrl: string;
  apiUrl: string;
  _id: string;
}

// Define the interface for the pull request data
interface PullRequest {
  number: number;
  title: string;
  html_url: string;
  state: string;
  merged: boolean;
}

const Page = () => {
  const token = getCookie("x-access-token");
  const [UserData, setUserData] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [prLoading, setPrLoading] = useState(false);
  const [prDetails, setPrDetails] = useState<PullRequest[]>([]);

  useEffect(() => {
    const getUserData = getCookie("user-data");
    const getUserType = getCookie("user-type");

    if (getUserData) {
      setUserData(JSON.parse(getUserData) || null);
      console.log("User Data", JSON.parse(getUserData));
    }

    const fetchData = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          token: token,
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };

        const response = await fetch(
          "https://oslead-backend.onrender.com/api/projects/enrolled-projects",
          requestOptions
        );
        const result = await response.json();

        if (result.length === 0) {
          toast.warn("Enroll Projects to See Enrolled Projects");
        }
        setProjects(result);
      } catch (error) {
        toast.error("Error fetching data. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const fetchPRDetails = async (username: string, apiUrl: string) => {
    setPrLoading(true);
    const apiURL = apiUrl.concat("/pulls?state=all");
    try {
      const response = await fetch(apiURL, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const userPRs = await Promise.all(
        data
          .filter(
            (pr: { user: { login: string } }) => pr.user.login === username
          )
          .map(
            async (pr: {
              number: number;
              title: string;
              html_url: string;
              state: string;
            }) => {
              const prDetailsResponse = await fetch(
                `${apiUrl}/pulls/${pr.number}`,
                {
                  headers: {
                    Accept: "application/vnd.github.v3+json",
                  },
                }
              );
              const prDetailsData = await prDetailsResponse.json();
              return {
                number: pr.number,
                title: pr.title,
                html_url: pr.html_url,
                state: pr.state,
                merged: prDetailsData.merged,
              };
            }
          )
      );
      setPrDetails(userPRs);
      toast.success("Pull Request details fetched successfully");
    } catch (error) {
      toast.error("Error fetching PRs. Please try again later.");
      console.error("Error fetching PRs:", error);
    } finally {
      setPrLoading(false);
    }
  };

  const openModal = (username: string, apiUrl: string) => {
    fetchPRDetails(username, apiUrl);
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    modal.showModal();
  };

  return (
    <div className="h-full bg-[#1C1E26] text-white">
      <NavBar />
      <h1 className="text-center text-2xl font-bold mt-20">
        Enrolled Projects
      </h1>

      <div className="flex flex-wrap justify-center gap-6 p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full w-full">
            <ClipLoader color="#3498db" loading={loading} size={150} />
          </div>
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="card w-full sm:w-96 bg-[#282c34] shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <div className="card-body p-6">
                <h2 className="card-title text-xl font-semibold mb-4">
                  {project.projectName}
                </h2>
                <p className="mb-4">
                  Check out the details of this project using the links below.
                </p>
                <div className="flex flex-col sm:flex-row justify-between">
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary mb-2 sm:mb-0 sm:mr-2"
                  >
                    View Project
                  </a>
                  <button
                    onClick={() => openModal(UserData.username, project.apiUrl)}
                    className="btn btn-secondary"
                  >
                    View PR Status
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-xl mt-10">No Projects Enrolled</p>
        )}
      </div>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box bg-[#1C1E26] text-white rounded-lg p-6">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-2xl mb-4">Pull Request Details</h3>
          {prLoading ? (
            <div className="flex items-center justify-center">
              <ClipLoader color="#3498db" loading={prLoading} size={60} />
            </div>
          ) : prDetails.length > 0 ? (
            <ul className="space-y-4">
              {prDetails.map((pr, index) => (
                <li key={index} className="border-b border-gray-600 pb-4">
                  <a
                    href={pr.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-xl"
                  >
                    {pr.title}
                  </a>
                  <p className="text-gray-400">PR Number: {pr.number}</p>
                  <p
                    className={`text-sm mt-1 ${
                      pr.state === "open"
                        ? "text-green-500"
                        : pr.state === "closed"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    Status: {pr.state}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      pr.merged ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {pr.merged ? "Merged" : "Not Merged"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-gray-400">
              No PRs found for this user in this project.
            </p>
          )}
        </div>
      </dialog>

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
