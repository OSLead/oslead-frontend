import React, { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function MyConfetti() {
  const { width, height } = useWindowSize();
  const [siteLoaded, setsiteLoaded] = useState(false);

  useEffect(() => {
    setsiteLoaded(true);
  }, []);

  if (!siteLoaded) {
    return null;
  }

  return (
    <ReactConfetti
      run={true}
      width={width}
      height={height + 500}
      recycle={false}
      numberOfPieces={4000}
      tweenDuration={5000}
    />
  );
}
