import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WebsiteLoader = ({ onAnimationComplete }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [fadeVideo, setFadeVideo] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    // Start overlay & video fade after 4 seconds
    const overlayTimer = setTimeout(() => {
      setOverlayVisible(true);
      setFadeVideo(true);
    }, 4000);

    // Unmount loader after overlay finishes (4 + 1s)
    const endTimer = setTimeout(() => {
      if (!finishedRef.current) {
        finishedRef.current = true;
        setShowLoader(false);
        if (typeof onAnimationComplete === "function") onAnimationComplete();
      }
    }, 5000); // total animation 5 seconds

    return () => {
      clearTimeout(overlayTimer);
      clearTimeout(endTimer);
    };
  }, [onAnimationComplete]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {/* Video container */}
          <div className="relative w-full h-full flex justify-center items-center">
            <motion.video
              src="/WebsiteLoader.mp4"
              autoPlay
              muted
              playsInline
              className="object-contain w-full max-w-[1440px] h-auto"
              style={{ maxHeight: "100vh" }}
              initial={{ opacity: 1 }}
              animate={fadeVideo ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }} // fades out over 1 second
            />

            {/* Overlay container slides upward */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-[#f3efee]"
              initial={{ height: "0%" }}
              animate={overlayVisible ? { height: "100%" } : { height: "0%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WebsiteLoader;
