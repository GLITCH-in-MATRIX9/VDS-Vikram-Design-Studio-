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
  const navigate = useNavigate();

  const handleOpenProject = (project) => setSelectedProject(project);
  const handleCloseSidebar = () => setSelectedProject(null);

  // When you click 'Modify', this takes you to the edit page for the selected project
  const handleModifyProject = () => {
    if (selectedProject) {
      navigate(`/admin/projects/edit/${selectedProject.id}`);
    }
  };

  // Updates the filter state when you change search/category/subcategory
  const onFilterChange = (newFilters) => {
    setFilterState(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="flex w-full h-full overflow-hidden bg-gray-50 rounded-lg shadow-inner">
      {/* The main dashboard area where you see and filter projects */}
      <div
        className={`flex-1 transition-all duration-300 relative ${selectedProject ? "md:w-3/4" : "w-full"
          }`}
      >
        <MiddleArea
          onProjectClick={handleOpenProject}
          filterState={filterState}
          onFilterChange={onFilterChange}
        />
      </div>

      {/* The sidebar pops up when you click a project, showing more details and actions */}
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