"use client";
import React, { useState, useEffect } from "react";
import NavBar from "@/components/Navbar/page";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "cookies-next";
import { css } from "@emotion/react";
import { RingLoader } from "react-spinners";

interface ProjectData {
  _id: string;
  projectDetails: {
    name: string;
    html_url: string;
    owner: {
      login: string;
      avatar_url: string;
      html_url: string;
    };
    description: string;
    language: string;
    created_at: string;
    updated_at: string;
  };
  contributors: {
    login: string;
    avatar_url: string;
  }[];
}

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Page = () => {
  const token = getCookie("x-access-token");
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null
  );
  const [enrolling, setEnrolling] = useState<boolean>(false); // State for enrollment loading

  const toggleModal = (project: ProjectData | null) => {
    setSelectedProject(project);
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
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
          "https://oslead-backend.onrender.com/api/projects/get-projects",
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setProjectData(result);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data. Please try again later.");
        toast.error("Error fetching data. Please try again later.");
        setLoading(false);
        console.error(error);
      }
    };

    fetchData();
  }, [token]);

  const enrollProject = async (_id: string) => {
    try {
      setEnrolling(true); // Set enrolling state to true when starting enrollment

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        token: token,
        projectId: _id,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch(
        "https://oslead-backend.onrender.com/api/projects/enroll-project",
        requestOptions
      );
      const result = await response.text();
      toast.success(result);
    } catch (error) {
      console.error("Error enrolling in project:", error);
      toast.error("Error enrolling in project");
    } finally {
      setEnrolling(false); // Reset enrolling state after enrollment attempt
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F16] text-white">
      <NavBar />
      <div className="pt-20 px-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Available Projects
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <RingLoader
              color={"#ffffff"}
              loading={loading}
              // css={override}
              size={150}
            />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#1C1E26] rounded-lg shadow-lg overflow-hidden">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="px-6 py-4 text-lg font-medium">
                    Project Name
                  </th>
                  <th className="px-6 py-4 text-lg font-medium">
                    Used Languages
                  </th>
                  <th className="px-6 py-4 text-lg font-medium">Details</th>
                  <th className="px-6 py-4 text-lg font-medium">Enroll</th>
                </tr>
              </thead>
              <tbody>
                {projectData?.length > 0 &&
                  projectData.map((project, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-300"
                    >
                      <td className="px-6 py-4">
                        <a
                          href={project.projectDetails.owner.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3"
                        >
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img
                                src={project.projectDetails.owner.avatar_url}
                                alt="Avatar"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">
                              {project.projectDetails.name}
                            </div>
                            <div className="text-sm opacity-50">
                              {project.projectDetails.owner.login}
                            </div>
                          </div>
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge badge-ghost badge-sm">
                          {project.projectDetails.language
                            ? project.projectDetails.language
                            : "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          target="_blank"
                          href={project.projectDetails.html_url}
                          className="btn btn-ghost btn-xl w-full text-white"
                        >
                          Details
                        </a>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => enrollProject(project._id)}
                          disabled={enrolling} // Disable button when enrolling
                          className={`btn btn-info w-24 h-10 text-white transition-transform transform hover:scale-105 ${
                            enrolling ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {enrolling ? "Enrolling..." : "Enroll"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
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
