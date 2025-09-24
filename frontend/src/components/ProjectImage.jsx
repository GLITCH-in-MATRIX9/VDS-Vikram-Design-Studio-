// ProjectImage.js
import React, { useState, useEffect } from "react";

const ProjectImage = ({ src, alt }) => {
  const [orientation, setOrientation] = useState('loading');

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      if (img.height > img.width) {
        setOrientation('portrait');
      } else {
        setOrientation('landscape');
      }
    };

    img.onerror = () => {
      console.error("Image failed to load:", src);
      setOrientation('landscape'); // Default to landscape on error
    };

  }, [src]); 

  if (orientation === 'loading') {
    return <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>;
  }

  const isPortrait = orientation === 'portrait';

  return (
    <div
      className={`${isPortrait ? 'aspect-[2/3] h-[calc(95vw/16*9)] sm:h-[225px] lg:h-[450px]' : 'aspect-video w-[95vw] sm:w-[400px] lg:w-[800px]'} rounded-lg shadow-md overflow-hidden`}
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