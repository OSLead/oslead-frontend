"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { getCookie, setCookie } from "cookies-next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MentorRegistration = () => {
  const token = getCookie("x-access-token");
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
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        setRegistrationSuccess(true);
        setCookie("user-data", JSON.stringify(formData), {
          maxAge: 60 * 6 * 24,
        });
        toast.success("Registration successful");
      } else {
        toast.error("Failed to register");
      }

      const result = await response.json();
      // console.log(result);
    } catch (error) {
      console.error(error);
      toast.error("Failed to register");
    }
  };

  useEffect(() => {
    if (registrationSuccess) {
      window.location.href = "/auth/projectowner/owner-dashboard";
    }
  }, [registrationSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4 py-12">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
          PA Registration Form
        </h2>
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
            <label className="block text-gray-300 mb-2">Contact Number</label>
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
            <label className="block text-gray-300 mb-2">Course Stream</label>
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
            <label className="block text-gray-300 mb-2">Delivery Details</label>
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
            <label className="block text-gray-300 mb-2">T-Shirt Color</label>
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
            Register
          </button>
        </form>
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
  );
};

export default MentorRegistration;
