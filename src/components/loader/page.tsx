// Import necessary dependencies
import React from "react";
import Lottie from "react-lottie";
import animationData from "../assets/toaster.json";

// Define the Loader component
const Loader = () => {
  // Define the options for the Lottie animation
  const defaultOptions = {
    loop: true, // Whether the animation should loop
    autoplay: true, // Whether the animation should start playing automatically
    animationData: animationData, // The animation data (Lottie animation JSON)
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice", // How the animation should be sized and positioned within its container
    },
  };

  return (
    <div>
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};

// Export the Loader component as default
export default Loader;
