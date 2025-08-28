import React, { useState } from "react";
import MiddleArea from "../MiddleArea";
import SidebarRight from "../SidebarRight";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenProject = (project) => setSelectedProject(project);
  const handleCloseSidebar = () => setSelectedProject(null);

  return (
    <div className="flex w-full h-full overflow-hidden bg-gray-50 rounded-lg shadow-inner">
      {/* middle area of the dashboard*/}
      <div
        className={`flex-1 transition-all duration-300 relative ${
          selectedProject ? "md:w-3/4" : "w-full"
        }`}
      >
        <MiddleArea onProjectClick={handleOpenProject} />
      </div>

      {/* right side bar of the dashboard , this opens on clicking project*/}
      {selectedProject && (
        <div className="border-l border-gray-300 bg-white shadow-lg">
          <SidebarRight project={selectedProject} onClose={handleCloseSidebar} />
        </div>
      )}
    </div>
  );
};

export default Projects;
