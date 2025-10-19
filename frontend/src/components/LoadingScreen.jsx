import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "../assets/Comp 1.json"; // Adjust this path if you place Comp 1.json elsewhere

const WebsiteLoader = ({ onAnimationComplete }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(false);
  // const [fadeLottie, setFadeLottie] = useState(false);
  const finishedRef = useRef(false);

  // This function is triggered when the Lottie animation finishes
  const handleLottieComplete = () => {
    setOverlayVisible(true); // Start the overlay slide-up

    // Set a timer to call onAnimationComplete *after* the overlay has finished sliding
    setTimeout(() => {
      if (!finishedRef.current) {
        finishedRef.current = true;
        setShowLoader(false); // Trigger the fade-out of the whole component
        if (typeof onAnimationComplete === "function") {
          onAnimationComplete();
        }
      }
    }, 1700); // This duration should match the overlay's animation duration
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
      initial={{ y: "0" }} // Start fully visible
      exit={{ y: "-100vh" }} // On exit, slide up and fade
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      <Lottie
        animationData={animationData}
        onComplete={handleLottieComplete}
        loop={false}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "1440px",
          maxHeight: "100vh",
        }}
      />
    </motion.div>
  );
};

export default WebsiteLoader;
