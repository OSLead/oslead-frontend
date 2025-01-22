"use client";
import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import NavBar from "@/components/Navbar/page";
import Loader from "@/components/loader/page";
import { toast } from "react-toastify";

export default function Page({ params }: { params: { token: string } }) {
  const [loading, setLoading] = useState(true);

  const [UserData, setUserData] = useState("Loading...");
  const getContributorDetails = async (token: string) => {
    console.log("Loading..");
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        token: token,
      });

      const requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "https://oslead-backend.vercel.app/api/maintainer/dashboard-profile",
        requestOptions
      );
      const data = await response.json();

      if (response.status === 200) {
        setUserData(data);
        console.log(data);
        toast.success("Login Successful");
        setCookie("x-access-token", params?.token, {
          maxAge: 60 * 6 * 24,
        });

        setCookie("user-data", JSON.stringify(data), {
          maxAge: 60 * 6 * 24,
        });
        if (data && data.college_name) {
          window.location.href = "/auth/projectowner/owner-dashboard";
        } else {
          window.location.href = "/registration/mentor-registration";
        }
        setCookie("user-type", "MAINTAINER", {
          maxAge: 60 * 6 * 24,
        });
      }
    } catch (error) {
      toast.error("Login failed");
    }
  };
  useEffect(() => {
    getContributorDetails(params.token);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <div className="h-screen bg-[#0D0F16]">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <NavBar />
        <div style={{ marginTop: "2rem" }}>
          {loading ? (
            <Loader />
          ) : (
            <div>
              <h1 className="text-3xl mb-4">Login Success</h1>
              <p>Welcome! You have successfully logged in.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}