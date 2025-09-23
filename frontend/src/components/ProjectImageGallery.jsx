import React from "react";

const ProjectImageGallery = ({ sections }) => {
  const firstImage = sections?.find(section => section.type === "image" || section.type === "gif");
  if (!firstImage) return null;

  return (
    // Corrected: Removed the grid and used a flex container to center the image.
    <div className="flex justify-center items-center w-full">
      <img
        src={firstImage.content}
        alt="Project"
        className="max-w-full  aspect-video object-cover rounded-lg shadow-md"
      />
    </div>
  );
};

export default ProjectImageGallery;