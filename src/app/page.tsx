"use client";
import NavBar from "@/components/Navbar/page";
import Image from "next/image";
import { useState, useEffect } from "react";
import "./globals.css";
import useWindowSize from "react-use/lib/useWindowSize";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCodeMerge } from "@fortawesome/free-solid-svg-icons";
import MyConfetti from "@/components/Confetti";
import { motion } from "framer-motion";
library.add(faCodeMerge);

interface User {
  _id: string;
  github_id: string;
  username: string;
  totalPoints: number;
  pointHistory: {
    pull_url: string;
    points: number;
    description: string;
    difficulty: string;
    _id: string;
  }[];
}

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { width, height } = useWindowSize();
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [topThree, setTopThree] = useState<User[]>([]);
  const [siteLoaded, setSiteLoaded] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "full" })
  );

  useEffect(() => {
    setSiteLoaded(true);
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const headersList = {
          Accept: "/",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        };

        const response = await fetch(
          "https://oslead-backend.onrender.com/api/projects/leaderboard",
          {
            method: "GET",
            headers: headersList,
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data: User[] = await response.json();
        setTopThree(data.slice(0, 3));
        setLeaderboard(data.slice(3));
        setLoadingLeaderboard(false);

        if (data.length > 3) {
          setShowConfetti(true);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleString("en-US", {
          dateStyle: "full",
          timeStyle: "full",
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleShowModal = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.3 },
    }),
  };

  return (
    <div className="min-h-screen bg-[#0D0F16]">
      <NavBar />

      {showModal && selectedUser && (
        <dialog id="my_modal_4" className="modal" open>
          <motion.div
            className="modal-box w-11/12 max-w-5xl bg-[#1C243A] text-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">
                {selectedUser.username} s Pull Requests
              </h3>
              <button
                onClick={handleCloseModal}
                className="btn hover:bg-red-500 text-white border-none py-2 px-4 rounded-md transition-colors duration-300"
              >
                Close
              </button>
            </div>
            <div className="py-4">
              {selectedUser.pointHistory.map((pr, index) => (
                <div key={pr._id} className="mb-4 p-4 bg-[#2E3A59] rounded-lg">
                  <p className="text-xl font-semibold">PR #{index + 1}</p>
                  <a
                    href={pr.pull_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    {pr.description}
                  </a>
                  <p>Points: {pr.points}</p>
                  <p>Difficulty: {pr.difficulty}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </dialog>
      )}

      <div className="hero bg-[#0D0F16] pt-20">
        <div className="hero-content text-center">
          <div className="max-w-xl">
            <div className="rounded-lg bg-opacity-10 backdrop-blur-lg hover:shadow transition duration-300">
              <p className="text-4xl md:text-4xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#c23dff] to-[#ff002f] font-[800]">
                OS{" "}
                <span className="text-transparent bg-clip-text font-[800] bg-gradient-to-r from-[#3dc5ff] to-[#1eff00]">
                  Leaderboard
                </span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r font-[800] from-[#ff3d6d] to-[#ffe100]">
                  2025
                </span>
              </p>
            </div>

            <p className="py-6 fontFamily: 'Roboto, sans-serif' text-white dark:text-white">
              Check your rank here!
            </p>
            <span className="mx-0.5 font-curlfont font-bold text-primarydark text-white dark:text-white">
              {currentTime}
            </span>
            {loadingLeaderboard && (
              <div>
                <div
                  style={{
                    scale: "2",
                  }}
                  className="loading loading-infinity loading-lg"
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showConfetti && <MyConfetti />}

      {!loadingLeaderboard && topThree.length + leaderboard.length < 4 ? (
        <div className="text-center text-white">
          The leaderboard is yet to be started Login if you have not created your account.
        </div>
      ) : (
        <>
          <div className="justify-items-center grid md:grid-cols-3 bg-[#0D0F16]">
            {topThree.map((user, index) => (
              <motion.div
                key={index}
                className="card w-100 glass border border-yellow-500 rounded-lg bg-opacity-10 backdrop-blur-lg drop-shadow-xl-2 hover:shadow-xl transition duration-300 transform hover:-translate-y-2"
                initial="hidden"
                animate="visible"
                custom={index}
                variants={cardVariants}
              >
                <div className="absolute top-0 left-0 m-2 bg-yellow-500 text-black font-bold rounded-full px-2 py-1">
                  Rank {index + 1}
                </div>
                <figure className="px-10 pt-10">
                  <Image
                    className="rounded-full"
                    alt="Contributor"
                    src={`https://avatars.githubusercontent.com/u/${user.github_id}?v=3`}
                    width={250}
                    height={250}
                  />
                </figure>
                <div className="card-body text-white dark:text-white">
                  <h2 className="card-title flex justify-center items-center">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://github.com/${user.username}`}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-[#3dc5ff] to-[#1eff00]"
                    >
                      {user.username}
                    </a>
                  </h2>
                  <p className="text-center text-bold text-white">
                    Points Scored:{" "}
                    <span className="text-yellow-500 font-bold">
                      {user.totalPoints}
                    </span>
                  </p>

                  <div className="card-actions justify-center">
                    <button
                      onClick={() => handleShowModal(user)}
                      className="btn btn-md bg-[#4e51ff] hover:bg-[#63b1ff] text-white border-none px-2 py-1 md:px-4 md:py-2 rounded-md transition duration-300 text-sm md:text-base"
                    >
                      <FontAwesomeIcon
                        icon={faCodeMerge}
                        style={{ color: "#76A8FF" }}
                        className="mr-2"
                      />
                      View all PRs
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="justify-center items-center bg-[#0D0F16] pb-20">
            <div className="pt-20 grid overflow-x-auto rounded-lg">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-center font-bold text-xl text-[#76ABFB]">
                      Rank
                    </th>
                    <th className="px-4 py-2 font-bold text-xl text-[#76ABFB]">
                      Contributor Name
                    </th>
                    <th className="px-4 py-2 text-center font-bold text-xl text-[#76ABFB]">
                      Points
                    </th>
                    <th className="px-4 py-2 text-center  font-bold text-xl text-[#76ABFB]">
                      View More
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user, index) => (
                    <tr
                      key={user._id}
                      className="bg-[#040608] border-b border-[#e1e372] hover:bg-[#1c1e25] text-white"
                    >
                      <td className="px-4 py-2 text-center">{index + 4}</td>
                      <td className="px-4 py-2 flex items-center space-x-2">
                        <Image
                          className="rounded-full"
                          alt="Contributor"
                          src={`https://avatars.githubusercontent.com/u/${user.github_id}?v=3`}
                          width={50}
                          height={50}
                        />
                        <div>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://github.com/${user.username}`}
                            className="text-blue-500 hover:underline"
                          >
                            {user.username}
                          </a>
                          <p className="text-xs text-gray-400">
                            Github ID: {user.github_id}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {user.totalPoints}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleShowModal(user)}
                          className="btn btn-md bg-[#4e51ff] hover:bg-[#63b1ff] text-white border-none px-2 py-1 md:px-4 md:py-2 rounded-md transition duration-300 text-sm md:text-base"
                        >
                          <FontAwesomeIcon
                            icon={faCodeMerge}
                            style={{ color: "#76A8FF" }}
                            className="mr-2"
                          />
                          View all PRs
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
