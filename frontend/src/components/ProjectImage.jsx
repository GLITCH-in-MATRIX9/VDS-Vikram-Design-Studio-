import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ProjectImage = ({ src, alt }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 450 });

  const updateDimensions = () => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      const height = window.innerWidth <= 640 ? 220 : 450;
      const imgRatio = img.width / img.height;
      const ratios = [
        { name: "2:3", value: 2 / 3 },
        { name: "4:3", value: 4 / 3 },
        { name: "16:9", value: 16 / 9 },
      ];
      const closest = ratios.reduce((prev, curr) =>
        Math.abs(curr.value - imgRatio) < Math.abs(prev.value - imgRatio)
          ? curr
          : prev
      );
      const width = Math.round(closest.value * height);
      setDimensions({ width, height });
    };

    img.onerror = () => {
      const height = window.innerWidth <= 640 ? 220 : 450;
      setDimensions({ width: Math.round((4 / 3) * height), height });
    };
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [src]);

  if (dimensions.width === 0) {
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
    );
  }

  return (
    <motion.div
      style={{ width: dimensions.width, height: dimensions.height }}
      className="rounded-lg shadow-md overflow-hidden"
      whileTap={{ scale: 0.97 }} // smooth click scale
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover object-center"
      />
    </motion.div>
  );
};

export default ProjectImage;
