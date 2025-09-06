import React from "react";

const ProjectSectionDisplay = ({ sections }) => {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section, index) => (
        <div key={index} className="w-full">
          {section.type === "text" ? (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {section.content}
              </p>
            </div>
          ) : section.type === "image" ? (
            <div className="flex justify-center">
              <img
                src={section.content}
                alt={`Project image ${index + 1}`}
                className="max-w-full h-auto rounded-lg shadow-md object-contain"
              />
            </div>
          ) : section.type === "gif" ? (
            <div className="flex justify-center">
              <img
                src={section.content}
                alt={`Project GIF ${index + 1}`}
                className="max-w-full h-auto rounded-lg shadow-md object-contain"
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default ProjectSectionDisplay;
