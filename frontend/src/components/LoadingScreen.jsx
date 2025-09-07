import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = [
  ["V", " ", "D", " ", "S"],
  ["ভ", " ", "D", " ", "স"],
  ["V", " ", "র", " ", "S"],
  ["V", " ", "D", " ", "S"],
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const LoadingScreen = ({ onAnimationComplete }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showFinalLogo, setShowFinalLogo] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
    // Let's start by cycling through the animated words one by one.
    if (currentWordIndex < words.length - 1) {
      const timer = setTimeout(() => {
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Now, let's reveal the final VDS logo after the word animation finishes.
      const finalLogoTimer = setTimeout(() => {
        setShowFinalLogo(true);
      }, 1000);
      return () => clearTimeout(finalLogoTimer);
    }
  }, [currentWordIndex]);

  useEffect(() => {
    if (showFinalLogo) {
      // First, let the logo shrink and move to the top corner.
      const cornerAnimationDuration = 1000; // This is how long the logo takes to move.
      const fadeOutDuration = 1000;        // This is how long the black screen fades out.

      // After all the animations are done, let's show the main app content.
      const totalAnimationTime = cornerAnimationDuration + fadeOutDuration;
      const completeTimer = setTimeout(() => {
        onAnimationComplete();
      }, totalAnimationTime);

      // Fade out the loading screen after the logo animation finishes.
      const fadeOutTimer = setTimeout(() => {
        setShowLoadingScreen(false);
      }, cornerAnimationDuration);

      return () => {
        clearTimeout(completeTimer);
        clearTimeout(fadeOutTimer);
      };
    }
  }, [showFinalLogo, onAnimationComplete]);

  return (
    <AnimatePresence>
      {showLoadingScreen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black z-50 overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 1, ease: "easeOut" } }}
        >
          {showFinalLogo ? (
            // The logo shrinks and slides to the top-left corner, like a curtain call.
            <motion.h1
              className="font-sora text-white text-6xl md:text-8xl lg:text-9xl tracking-wider uppercase"
              initial={{ opacity: 0, scale: 1, x: 0, y: 0 }}
              animate={{ opacity: 1, scale: 0.2, x: '-45vw', y: '-45vh' }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              V D S
            </motion.h1>
          ) : (
            // Each word animates in, letter by letter, for a lively intro.
            <motion.h1
              key={currentWordIndex}
              className="font-sora text-white text-6xl md:text-8xl lg:text-9xl tracking-wider uppercase"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {words[currentWordIndex].map((letter, index) => (
                  <motion.span key={index} variants={letterVariants} className="inline-block">
                    {letter}
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.h1>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;