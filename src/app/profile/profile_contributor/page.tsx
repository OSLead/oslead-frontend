"use client";
import React, { useEffect, useState } from "react";
import NavBar from "@/components/Navbar/page";
import { getCookie } from "cookies-next";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const Page = () => {
  const [userData, setUserData] = useState<any>(null);
  const [evalData, setEvalData] = useState<any>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = getCookie("user-data");
    const token = getCookie("x-access-token");

    if (getUserData) {
      const parsedUserData = JSON.parse(getUserData);
      setUserData(parsedUserData || null);

      // Fetch GitHub profile photo
      fetch(`https://api.github.com/user/${parsedUserData.github_id}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData((prevState: any) => ({
            ...prevState,
            profile_picture: data.avatar_url || "",
          }));
        })
        .catch((error) => console.error("Error fetching GitHub photo:", error));
    }
    // console.log(token);

    // Fetch additional data from the new API
    const fetchAdditionalData = async () => {
      let headersList = {
        Accept: "/",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        token: token,
      });

      try {
        let response = await fetch(
          "https://oslead-backend.vercel.app/api/contributor/dashboard-profile",
          {
            method: "POST",
            body: bodyContent,
            headers: headersList,
          }
        );

        let data = await response.json();
        setEvalData(data.evalDetails || null);
        setRank(data.rank || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching additional data:", error);
        setLoading(false);
      }
    };

    fetchAdditionalData();
  }, []);

  return (
    <div className="h-full min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
      <NavBar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">My Profile</h1>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <ClipLoader color="#ffffff" loading={loading} size={50} />
          </div>
        ) : (
          <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              {userData.profile_picture && (
                <img
                  src={userData.profile_picture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mr-4 border-4 border-indigo-500"
                />
              )}
              <div>
                <h2 className="text-3xl font-bold">{userData.name}</h2>
                <p className="text-xl text-indigo-500">@{userData.username}</p>
                <p className="text-sm text-gray-400">{userData.email}</p>
              </div>
            </div>
            {evalData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-indigo-500">
                    Total Points
                  </h3>
                  <p className="bg-gray-100 p-2 rounded">
                    {evalData.totalPoints}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-indigo-500">
                    Rank
                  </h3>
                  <p className="bg-gray-100 p-2 rounded">{rank}</p>
                </div>
              </div>
            ) : (
              <p className="text-center text-xl text-gray-500">
                Rank not available
              </p>
            )}
            <div className="md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-1 text-indigo-500">
                  College Name
                </h3>
                <p className="bg-gray-100 p-2 rounded">
                  {userData.college_name}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1 text-indigo-500">
                  Delivery Details
                </h3>
                <p className="bg-gray-100 p-2 rounded">
                  City: {userData.delivery_details?.city}
                </p>
                <p className="bg-gray-100 p-2 rounded">
                  State: {userData.delivery_details?.state}
                </p>
                <p className="bg-gray-100 p-2 rounded">
                  Pincode: {userData.delivery_details?.pincode}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1 text-indigo-500">
                  T-Shirt
                </h3>
                <p className="bg-gray-100 p-2 rounded">
                  Color: {userData.delivery_details?.tshirt?.color}
                </p>
                <p className="bg-gray-100 p-2 rounded">
                  Size: {userData.delivery_details?.tshirt?.size}
                </p>
              </div>
              {evalData && evalData.pointHistory.length > 0 ? (
                <div className="col-span-2">
                  <h3 className="text-xl font-semibold mb-1 text-indigo-500">
                    Points History
                  </h3>
                  <ul className="bg-gray-100 p-4 rounded space-y-2">
                    {evalData.pointHistory.map((point: any) => (
                      <li
                        key={point._id}
                        className="flex justify-between items-center bg-gray-200 p-2 rounded"
                      >
                        <div>
                          <p className="text-gray-900">{point.description}</p>
                          <p className="text-sm text-gray-600">
                            Difficulty: {point.difficulty}
                          </p>
                        </div>
                        <a
                          href={point.pull_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View Pull Request
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-center text-xl text-gray-500">
                  Give PRs to show the pull history
                </p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold mb-1 text-indigo-500">
                  Social Links
                </h3>
                <div className="flex space-x-4">
                  <a
                    href={`https://github.com/${userData?.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <FaGithub size={30} />
                  </a>
                  <a
                    href={userData?.linked_in}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <FaLinkedin size={30} />
                  </a>
                </div>
              </div>
              <a
                className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-black"
                href="/update_details/contributor"
              >
                Update Details
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
