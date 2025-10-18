import React, { useState, useEffect } from "react";

const ProjectImage = ({ src, alt }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 450 });

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      const height = 450;
      const imgRatio = img.width / img.height;

      // Define target ratios
      const ratios = [
        { name: "2:3", value: 2 / 3 },
        { name: "4:3", value: 4 / 3 },
        { name: "16:9", value: 16 / 9 },
      ];

      // Find closest ratio
      const closest = ratios.reduce((prev, curr) => {
        return Math.abs(curr.value - imgRatio) < Math.abs(prev.value - imgRatio)
          ? curr
          : prev;
      });

      const width = Math.round(closest.value * height);
      setDimensions({ width, height });
    };

    img.onerror = () => {
      console.error("Image failed to load:", src);
      setDimensions({ width: Math.round((4 / 3) * 450), height: 450 });
    };
  }, [src]);

  if (dimensions.width === 0) {
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
    );
  }

  return (
    <div
      style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
      className="rounded-lg shadow-md overflow-hidden"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
};

export default ProjectImage;
