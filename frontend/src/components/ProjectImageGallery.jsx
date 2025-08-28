import React from "react";

const ProjectImageGallery = ({ sections }) => {
  const firstImage = sections?.find(section => section.type === "image");
  if (!firstImage) return null;

  return (
    <div className="grid grid-cols-2 w-full mt-0 pt-0">

      <div className="flex justify-center items-start">
        <img
          src={firstImage.content}
          alt="Project"
          className="max-w-full max-h-auto object-contain rounded-lg shadow-md"
        />
      </div>
    
      <div></div>
    </div>
  );
};

export default ProjectImageGallery;
