import React from "react";

const ProjectSectionDisplay = ({ sections }) => {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="flex h-full">
      {sections.map((section, index) => (
        <div
          key={index}
          className="flex-shrink-0 flex flex-col gap-4 items-center px-2 lg:px-6 justify-center"
          // Removed inline width here. Each block will have its own width defined inside.
        >
          {section.type === "text" ? (
            <div className=" p-4 " style={{ minWidth: '320px', maxWidth: '400px' }}>
              <p className="text-gray-700 leading-[140%] md:leading-relaxed whitespace-pre-wrap text-sm ">
                {section.content}
              </p>
            </div>
          ) : (section.type === "image" || section.type === "gif") ? (
            <div 
              className="w-[95vw] max-w-[800px] sm:w-[400px] lg:w-[800px] aspect-video rounded-lg shadow-md overflow-hidden" 
              // style={{ width: '800px', height: '450px' }}
            >
              <img
                src={section.content}
                alt={`Project ${section.type} ${index + 1}`}
                className="w-full object-cover"
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default ProjectSectionDisplay;