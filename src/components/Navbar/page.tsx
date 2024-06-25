"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NavBar = () => {
  const [UserData, setUserData] = useState<any>(null);
  const [UserType, setUserType] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserData = getCookie("user-data");
    const getUserType = getCookie("user-type");

    if (getUserData) {
      setUserData(JSON.parse(getUserData) || null);
      // console.log("User Data", JSON.parse(getUserData));
    }

    if (getUserType) {
      setUserType(getUserType || null);
      // console.log("User Type", getUserType);
    }
  }, []);

  const handleLogout = () => {
    deleteCookie("user-data");
    deleteCookie("user-type");
    setUserData(null);
    setUserType(null);
    router.push("/"); // Redirect to the homepage or login page
  };

  return (
    <div className="navbar bg-[#0D0F16] border-b border-[#1B1F30] border-2 shadow-[#141831] shadow-md fixed top-0 w-full z-50">
      <div className=" flex-1">
        <Link href={"/"} className="text-3xl font-[100]">
          <span className="text-[#fff] font-[600]">Os </span>
          <span className="text-[#ff1b7a] font-[600]">Lead</span>
        </Link>
      </div>
      <div className="flex-none gap-2">
        {!UserData && (
          <button
            onClick={() => {
              console.log("clicked");
              window.location.href = "/usertype";
            }}
            className="btn bg-[#1C243A] drawer-button flex items-center text-white hover:bg-blue-700 transition-colors duration-300 border-none"
          >
            <FontAwesomeIcon icon={faGithub} size="lg" className="mr-2" />
            Sign in With Github
          </button>
        )}
        {UserData && (
          <a
            target="_blank"
            href={`https://github.com/${UserData.username}`}
            className="btn bg-[#1C243A] drawer-button flex items-center text-white hover:bg-blue-700 transition-colors duration-300 border-none"
          >
            <FontAwesomeIcon icon={faGithub} className="mr-2" />
            {UserData.name}
          </a>
        )}

        {UserData && UserType === "MAINTAINER" && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <Image
                  alt="User Avatar"
                  src={`https://avatars.githubusercontent.com/u/${UserData?.github_id}?v=4`}
                  width={40}
                  height={40}
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-[#181d21]  text-white rounded-box w-52"
            >
              <li>
                <a
                  href={"/profile/profile_maintainer"}
                  className="justify-between"
                >
                  Profile
                </a>
              </li>
              <li>
                <a href={"/auth/projectowner/owner-dashboard"}>
                  Mentor Dashboard
                </a>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        )}
        {UserData && UserType === "CONTRIBUTOR" && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <Image
                  alt="User Avatar"
                  src={`https://avatars.githubusercontent.com/u/${UserData?.github_id}?v=4`}
                  width={40}
                  height={40}
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-[#181d21] text-white  rounded-box w-52"
            >
              <li>
                <a
                  href={"/profile/profile_contributor"}
                  className="justify-between"
                >
                  Profile
                </a>
              </li>
              <li>
                <a href={"/contributor_index"}>Contributor Dashboard</a>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;