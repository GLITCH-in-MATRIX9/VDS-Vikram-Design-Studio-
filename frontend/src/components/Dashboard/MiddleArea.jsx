import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AddProject from "./AddProject";
import {
  FiSearch,
  FiSettings,
  FiPlus,
  FiArrowLeft,
  FiChevronDown,
  FiXCircle,
} from "react-icons/fi";

const API_URL = "http://localhost:5000/api/projects";

const MiddleArea = ({ onProjectClick, filterState, onFilterChange }) => {
  const { searchTerm, selectedCategory, selectedSubCategory } = filterState;
  const [projects, setProjects] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef(null);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(API_URL);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ✅ FIXED: handles both Add + Edit cancel
  const onCancelModify = () => {
    setEditingProject(null);
    setShowAddProject(false);
  };

  const filterOptions = {
    Education: ["Schools", "Training Institutions/Centres", "Research Centres", "Colleges & Universities"],
    Healthcare: ["Hospitals", "Medical Colleges", "Diagnostic Labs", "Clinics"],
    Civic: ["Auditoriums", "Town Halls", "Police Stations", "Public toilets & amenities"],
    Workspace: ["Government offices", "Corporate offices", "Research Centres"],
    Sports: ["Stadiums", "Sports complex", "Multipurpose sports halls"],
    Culture: ["Religious", "Memorials", "Cultural complex", "Museums"],
    Residential: ["Staff quarters", "Private Villas", "Housing", "Hostels", "Guest Houses"],
    Hospitality: ["Hotels", "Resorts", "Restaurants", "Tourism Lodges"],
    Retail: ["Showrooms", "Shopping complex", "Departmental stores", "Multiplexes"],
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? project.category === selectedCategory : true;
    const matchesSubCategory = selectedSubCategory ? project.subCategory === selectedSubCategory : true;
    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  const isAddingOrModifying = showAddProject || editingProject;

  const handleAddProjectClick = () => {
    setShowAddProject(true);
    setEditingProject(null); // reset edit mode if open
  };

  const handleSearchChange = (e) => onFilterChange({ searchTerm: e.target.value });
  const handleCategoryClick = (category) =>
    onFilterChange({
      selectedCategory: selectedCategory === category ? null : category,
      selectedSubCategory: null,
    });
  const handleSubCategoryClick = (subCategory) =>
    onFilterChange({
      selectedSubCategory: selectedSubCategory === subCategory ? null : subCategory,
    });
  const handleClearFilters = () => {
    onFilterChange({ searchTerm: "", selectedCategory: null, selectedSubCategory: null });
    setIsFilterMenuOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-white">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {!isAddingOrModifying && (
          <div className="relative w-full md:w-1/2">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-gray-300 px-10 py-2 w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            />
          </div>
        )}
        <div className="flex gap-3">
          {!isAddingOrModifying && (
            <div className="relative" ref={filterMenuRef}>
              <button
                onClick={() => setIsFilterMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition text-sm"
              >
                {isFilterMenuOpen ? <FiChevronDown /> : <FiSettings />} Filter
              </button>
              {isFilterMenuOpen && (
                <div className="absolute top-full mt-2 right-0 md:left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20">
                  <h3 className="font-bold text-gray-800 mb-3 text-sm">Filter by Category</h3>
                  <div className="flex flex-col gap-2 mb-4">
                    {Object.keys(filterOptions).map((category) => (
                      <div key={category}>
                        <button
                          onClick={() => handleCategoryClick(category)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition flex items-center justify-between ${
                            selectedCategory === category
                              ? "bg-blue-500 text-white font-semibold"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {category}
                          <FiChevronDown
                            className={`${
                              selectedCategory === category ? "rotate-180" : ""
                            } transform transition-transform`}
                          />
                        </button>
                        {selectedCategory === category && (
                          <div className="flex flex-col gap-2 mt-2 ml-4 border-l pl-2">
                            {filterOptions[category].map((sub) => (
                              <button
                                key={sub}
                                onClick={() => handleSubCategoryClick(sub)}
                                className={`w-full text-left px-2 py-1 text-sm rounded-md transition ${
                                  selectedSubCategory === sub
                                    ? "bg-[#2b7efe] text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {sub}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {(selectedCategory || selectedSubCategory || searchTerm) && (
                    <button
                      onClick={handleClearFilters}
                      className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                    >
                      <FiXCircle /> Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          <button
            onClick={() =>
              isAddingOrModifying ? onCancelModify() : handleAddProjectClick()
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition ${
              isAddingOrModifying
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isAddingOrModifying ? (
              <>
                <FiArrowLeft /> Back
              </>
            ) : (
              <>
                <FiPlus /> Add Project
              </>
            )}
          </button>
        </div>
      </div>

      {/* Project Table / AddProject Form */}
      <div className="flex-1 overflow-y-auto border-gray-200 max-h-[80vh]">
        {editingProject ? (
          <AddProject
            projectToEdit={editingProject}
            onCancel={onCancelModify}
            refreshProjects={fetchProjects}
          />
        ) : showAddProject ? (
          <AddProject
            onCancel={onCancelModify}
            refreshProjects={fetchProjects}
          />
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-[#D5CFCC] border-b border-gray-300 z-10">
              <tr>
                <th className="p-3 font-medium text-gray-700">Order</th>
                <th className="font-medium text-gray-700">Status</th>
                <th className="p-3 font-medium text-gray-700">Image</th>
                <th className="p-3 font-medium text-gray-700">Project Name</th>
                <th className="p-3 font-medium text-gray-700">Year</th>
                <th className="p-3 font-medium text-gray-700">Category</th>
                <th className="p-3 font-medium text-gray-700">Subcategory</th>
                <th className="p-3 font-medium text-gray-700">Date Created</th>
                <th className="p-3 font-medium text-gray-700">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, index) => (
                <tr
                  key={project._id}
                  className="cursor-pointer transition hover:bg-blue-50"
                  onClick={() => onProjectClick && onProjectClick(project)}
                >
                  <td className="p-3 border-b border-gray-200">{index + 1}</td>
                  <td className="p-3 border-b border-gray-200">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        project.active ? "bg-green-500" : "bg-blue-400"
                      }`}
                    ></span>
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    <img
                      src={project.previewImageUrl || "https://picsum.dev/300/200"}
                      alt={project.name}
                      className="w-16 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="p-3 border-b border-gray-200 max-w-[200px] truncate">
                    {project.name}
                  </td>
                  <td className="p-3 border-b border-gray-200">{project.year}</td>
                  <td className="p-3 border-b border-gray-200">{project.category}</td>
                  <td className="p-3 border-b border-gray-200">{project.subCategory}</td>
                  <td className="p-3 border-b border-gray-200">
                    {project.createdAt?.slice(0, 10)}
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    {project.updatedAt?.slice(0, 10)}
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-4 text-center text-gray-500">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MiddleArea;
