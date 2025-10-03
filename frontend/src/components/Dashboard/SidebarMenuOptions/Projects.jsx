import React, { useState } from "react";
import MiddleArea from "../MiddleArea";
import SidebarRight from "../SidebarRight";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterState, setFilterState] = useState({
    searchTerm: '',
    selectedCategory: null,
    selectedSubCategory: null,
  });
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  const handleOpenProject = (project) => setSelectedProject(project);
  const handleCloseSidebar = () => setSelectedProject(null);

  const handleModifyProject = () => {
    if (selectedProject && (selectedProject._id || selectedProject.id)) {
      setEditingProject(selectedProject);
    }
  };

  const handleCancelModify = () => {
    setEditingProject(null);
    setSelectedProject(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilterState(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="flex w-full h-full overflow-hidden bg-gray-50 rounded-lg shadow-inner">
      <div className={`flex-1 transition-all duration-300 relative ${selectedProject ? "md:w-3/4" : "w-full"}`}>
        <MiddleArea
          onProjectClick={handleOpenProject}
          filterState={filterState}
          onFilterChange={handleFilterChange}
          editingProject={editingProject}
          onCancelModify={handleCancelModify}
        />
      </div>

      {selectedProject && (
        <div className="border-l border-gray-300 bg-white shadow-lg">
          <SidebarRight
            project={selectedProject}
            onClose={handleCloseSidebar}
            onModify={handleModifyProject}
          />
        </div>
      )}
    </div>
  );
};

export default Projects;
