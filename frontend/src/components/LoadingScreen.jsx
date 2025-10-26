import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "../assets/Comp 1.json"; 

const WebsiteLoader = ({ onAnimationComplete }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(false);
  
  const finishedRef = useRef(false);

  const handleLottieComplete = () => {
    setOverlayVisible(true); 

    setTimeout(() => {
      if (!finishedRef.current) {
        finishedRef.current = true;
        setShowLoader(false);
        if (typeof onAnimationComplete === "function") {
          onAnimationComplete();
        }
      }
    }, 1000); 
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
      initial={{ y: "0" }} 
      exit={{ y: "-100vh" }}
      transition={{ duration: 1, ease: [0.65, 0, 0.24, 1] }}
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
