"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { getCookie, setCookie } from "cookies-next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "@/components/Navbar/page";
import { ClipLoader } from "react-spinners";

const Page = () => {
  const token = getCookie("x-access-token") as string | undefined;
  const [formData, setFormData] = useState({
    collegeName: "",
    contactNumber: "",
    courseStream: "",
    linkedinUrl: "",
    city: "",
    state: "",
    pincode: "",
    tshirtSize: "",
    tshirtColor: "",
  });
  const [updationSuccess, setUpdationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleColorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const ChangeData = async (token: string) => {
    console.log("Loading..");
    setLoading(true);
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
        "https://oslead-backend.onrender.com/api/maintainer/profile-details",
        requestOptions
      );
      const data = await response.json();

      if (response.status === 200) {
        setUpdationSuccess(true);
        console.log("CHANGED DATA");
        console.log(data);
        toast.success("Details updated successfully !!");

        setCookie("user-data", JSON.stringify(data), {
          maxAge: 60 * 6 * 24,
        });

        setCookie("user-type", "MAINTAINER", {
          maxAge: 60 * 6 * 24,
        });
      }
    } catch (error) {
      toast.error("Update Failed ");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token is missing");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://oslead-backend.onrender.com/api/maintainer/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            linked_in: formData.linkedinUrl,
            city: formData.city,
            pincode: formData.pincode,
            tsize: formData.tshirtSize,
            tcolor: formData.tshirtColor,
            state: formData.state,
            college_name: formData.collegeName,
          }),
        }
      );
      if (response.status === 200) {
        ChangeData(token); // Call ChangeData function here
      } else {
        toast.error("Failed to register");
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
      toast.error("Failed to register");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (updationSuccess) {
      window.location.href = "/profile/profile_maintainer";
    }
  }, [updationSuccess]);

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4 py-12">
        <div className="bg-gray-800 text-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
            Mentor Details Updation Form
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <ClipLoader color="#3498db" loading={loading} size={50} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* College Name */}
              <div className="form-group">
                <label className="block text-gray-300 mb-2">College Name</label>
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  placeholder="Enter your college name"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400"
                  required
                />
              </div>

              {/* Contact Number */}
              <div className="form-group">
                <label className="block text-gray-300 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400"
                  required
                />
              </div>

              {/* Course Stream */}
              <div className="form-group">
                <label className="block text-gray-300 mb-2">
                  Course Stream
                </label>
                <input
                  type="text"
                  name="courseStream"
                  value={formData.courseStream}
                  onChange={handleChange}
                  placeholder="Enter your course stream"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400"
                  required
                />
              </div>

              {/* LinkedIn URL */}
              <div className="form-group">
                <label className="block text-gray-300 mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="Enter your LinkedIn URL"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400"
                  required
                />
              </div>

              {/* Delivery Details */}
              <div className="form-group">
                <label className="block text-gray-300 mb-2">
                  Delivery Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400"
                    required
                  />
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              {/* T-Shirt Details */}
              <div className="form-group">
                <label className="block text-gray-300 mb-2">T-Shirt Size</label>
                <input
                  type="text"
                  name="tshirtSize"
                  value={formData.tshirtSize}
                  onChange={handleChange}
                  placeholder="Enter your T-shirt size"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-300 mb-2">
                  T-Shirt Color
                </label>
                <select
                  name="tshirtColor"
                  value={formData.tshirtColor}
                  onChange={handleColorChange}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400"
                  required
                >
                  <option value="">Select Color</option>
                  <option value="Light">Light</option>
                  <option value="Dark">Dark</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition duration-300"
              >
                Update
              </button>
            </form>
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
      </div>
    </div>
  );
};

export default Page;
