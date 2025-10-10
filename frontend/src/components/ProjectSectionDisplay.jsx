import React from "react";
import ProjectImage from "./ProjectImage";

const ProjectSectionDisplay = ({ sections }) => {
  if (!sections || sections.length === 0) return null;
  return (
    <div className="project-section flex h-full">
      {sections.map((section, index) => {
        return (
          <div
            key={index}
            className="flex-shrink-0 flex flex-col gap-4 items-center px-2 lg:px-6 justify-center"
            // Removed inline width here. Each block will have its own width defined inside.
          >
            {section.type === "text" ? (
              <div
                className=" p-4 "
                style={{ minWidth: "320px", maxWidth: "400px" }}
              >
                <p className="text-gray-700 leading-[140%] md:leading-relaxed whitespace-pre-wrap text-sm ">
                  {section.content}
                </p>
              </div>
            ) : section.type === "image" || section.type === "gif" ? (
              <ProjectImage
                src={section.content}
                alt={`Project ${section.type} ${index + 1}`}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default ProjectSectionDisplay;
