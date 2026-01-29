import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiSettings,
  FiPlus,
  FiArrowLeft,
  FiChevronDown,
  FiXCircle,
} from "react-icons/fi";
import AddProject from "./Projects/AddProject";
import projectApi from "../../services/projectApi";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const COLOR_PRIMARY_ACTION = "#454545";
const COLOR_PRIMARY_HOVER = "#666666";
const COLOR_TEXT_BODY = "#454545";
const COLOR_HEADER_BG = "#D5CFCC";
const COLOR_SURFACE_SUBTLE = "#F5F1EE";
const COLOR_ACTIVE_STATUS = "#529F52";
const COLOR_INACTIVE_STATUS = "#C94A4A";
const COLOR_BORDER = "#C9BEB8";
const COLOR_COMPLETED = "#28a745";

const MiddleArea = ({ onProjectClick, filterState, onFilterChange }) => {
  const { searchTerm, selectedCategory, selectedSubCategory } = filterState;
  const [projects, setProjects] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const filterMenuRef = useRef(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectApi.getProjects();
      const projectsWithStatus = data.map((p) => ({
        ...p,
        active: ["On-site", "Design stage"].includes(p.status),
        completed: p.status === "Completed",
      }));
      setProjects(projectsWithStatus);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target)
      ) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const onCancelModify = () => {
    setEditingProject(null);
    setShowAddProject(false);
  };

  const filterOptions = {
    Education: [
      "Schools",
      "Training Institutions/Centres",
      "Research Centres",
      "Colleges & Universities",
    ],
    Healthcare: [
      "Hospitals",
      "Medical Colleges",
      "Diagnostic Labs",
      "Clinics",
    ],
    Civic: [
      "Auditoriums",
      "Town Halls",
      "Police Stations",
      "Public toilets & amenities",
    ],
    Workspace: [
      "Government offices",
      "Corporate offices",
      "Research Centres",
    ],
    Sports: ["Stadiums", "Sports complex", "Multipurpose sports halls"],
    Culture: ["Religious", "Memorials", "Cultural complex", "Museums"],
    Residential: [
      "Staff quarters",
      "Private Villas",
      "Private Apartments",
      "Housing",
      "Hostels",
      "Guest Houses",
    ],
    Hospitality: ["Hotels", "Resorts", "Restaurants", "Tourism Lodges"],
    Retail: [
      "Showrooms",
      "Shopping complex",
      "Departmental stores",
      "Multiplexes",
    ],
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory
      ? project.category?.toUpperCase() === selectedCategory.toUpperCase()
      : true;

    const matchesSubCategory = selectedSubCategory
      ? project.subCategory?.toUpperCase() ===
      selectedSubCategory.toUpperCase()
      : true;

    return matchesSearch && matchesCategory && matchesSubCategory;
  });


  const isAddingOrModifying = showAddProject || editingProject;

  const handleAddProjectClick = () => {
    setShowAddProject(true);
    setEditingProject(null);
  };

  const handleSearchChange = (e) =>
    onFilterChange({ searchTerm: e.target.value });
  const handleCategoryClick = (category) =>
    onFilterChange({
      selectedCategory:
        selectedCategory === category ? null : category,
      selectedSubCategory: null,
    });
  const handleSubCategoryClick = (subCategory) =>
    onFilterChange({
      selectedSubCategory:
        selectedSubCategory === subCategory ? null : subCategory,
    });
  const handleClearFilters = () => {
    onFilterChange({
      searchTerm: "",
      selectedCategory: null,
      selectedSubCategory: null,
    });
    setIsFilterMenuOpen(false);
  };

  const TableCell = ({ children, className = "" }) => (
    <td
      className={`px-3 py-2 border-b border-gray-200 text-sm ${className}`}
      style={{ color: COLOR_TEXT_BODY }}
    >
      {children}
    </td>
  );

  const TableHeaderCell = ({ children, className = "" }) => (
    <th
      className={`px-3 py-2 font-medium opacity-70 ${className}`}
      style={{ color: COLOR_TEXT_BODY }}
    >
      {children}
    </th>
  );

  return (
    <div className="flex-1 flex flex-col p-6">
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
              style={{
                borderColor: COLOR_BORDER,
                color: COLOR_TEXT_BODY,
              }}
              className="px-10 py-2 w-full text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-lg"
              autoComplete="off"
            />
          </div>
        )}

        <div className="flex gap-3">
          {!isAddingOrModifying && (
            <div className="relative" ref={filterMenuRef}>
              <button
                onClick={() =>
                  setIsFilterMenuOpen((prev) => !prev)
                }
                className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 transition"
                style={{
                  borderColor: COLOR_BORDER,
                  color: COLOR_TEXT_BODY,
                }}
              >
                <FiSettings /> Filter{" "}
                <FiChevronDown
                  className={`${isFilterMenuOpen ? "rotate-180" : ""
                    } transform transition-transform text-xs`}
                />
              </button>

              {isFilterMenuOpen && (
                <div
                  className="absolute top-full mt-2 right-0 md:left-0 w-64 bg-white border rounded-lg shadow-lg p-4 z-20"
                  style={{ borderColor: COLOR_BORDER }}
                >
                  <h3
                    className="font-bold mb-3 text-sm"
                    style={{ color: COLOR_TEXT_BODY }}
                  >
                    Filter by Category
                  </h3>

                  <div className="flex flex-col gap-1 mb-4">
                    {Object.keys(filterOptions).map((category) => (
                      <div key={category}>
                        <button
                          onClick={() =>
                            handleCategoryClick(category)
                          }
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition flex items-center justify-between ${selectedCategory === category
                            ? "bg-gray-700 text-white font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          {category}
                          <FiChevronDown
                            className={`${selectedCategory === category
                              ? "rotate-180"
                              : ""
                              } transform transition-transform text-xs`}
                          />
                        </button>

                        {selectedCategory === category && (
                          <div className="flex flex-col gap-1 mt-1 ml-4 border-l border-gray-200 pl-2">
                            {filterOptions[category].map((sub) => (
                              <button
                                key={sub}
                                onClick={() =>
                                  handleSubCategoryClick(sub)
                                }
                                className={`w-full text-left px-2 py-1 text-xs rounded-md transition ${selectedSubCategory === sub
                                  ? "bg-gray-700 text-white"
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

                  {(selectedCategory ||
                    selectedSubCategory ||
                    searchTerm) && (
                      <button
                        onClick={handleClearFilters}
                        className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
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
              isAddingOrModifying
                ? onCancelModify()
                : handleAddProjectClick()
            }
            style={{
              backgroundColor: isAddingOrModifying
                ? COLOR_PRIMARY_HOVER
                : COLOR_PRIMARY_ACTION,
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition hover:bg-gray-700"
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

      {/* Table */}
      <div
        className="flex-1 overflow-y-auto border-t max-h-[80vh]"
        style={{ borderColor: COLOR_BORDER }}
      >
        {editingProject || showAddProject ? (
          <AddProject
            projectToEdit={editingProject}
            onCancel={onCancelModify}
            refreshProjects={fetchProjects}
          />
        ) : isLoading ? (
          <ProjectTableSkeleton
            TableHeaderCell={TableHeaderCell}
            TableCell={TableCell}
          />
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead
              className="sticky top-0 z-10"
              style={{ backgroundColor: COLOR_HEADER_BG }}
            >
              <tr>
                <TableHeaderCell>Order</TableHeaderCell>
                <TableHeaderCell className="w-[40px] text-center">
                  Status
                </TableHeaderCell>
                <TableHeaderCell>Image</TableHeaderCell>
                <TableHeaderCell>Project Name</TableHeaderCell>
                <TableHeaderCell>Year</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Subcategory</TableHeaderCell>
                <TableHeaderCell>Date Created</TableHeaderCell>
                <TableHeaderCell>Last Modified</TableHeaderCell>
              </tr>
            </thead>

            <DragDropContext
              onDragEnd={(result) => {
                if (!result.destination) return;

                // 🚫 Prevent drag when filters/search are active
                if (searchTerm || selectedCategory || selectedSubCategory) {
                  return;
                }

                const from = result.source.index;
                const to = result.destination.index;
                if (from === to) return;

                setProjects((prev) => {
                  const updated = Array.from(prev);
                  const [moved] = updated.splice(from, 1);
                  updated.splice(to, 0, moved);

                  projectApi.reorderProjects(updated.map((p) => p._id));
                  return updated;
                });
              }}
            >
              <Droppable droppableId="projects">
                {(provided) => (
                  <tbody ref={provided.innerRef} {...provided.droppableProps}>
                    {projects.map((project, index) => (
                      <Draggable
                        key={project._id}
                        draggableId={project._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`cursor-move transition ${snapshot.isDragging ? "bg-gray-200" : "hover:bg-gray-100"
                              }`}
                            onClick={() =>
                              onProjectClick && onProjectClick(project)
                            }
                          >
                            <TableCell>{index + 1}</TableCell>

                            <TableCell className="text-center">
                              <span
                                className="inline-block w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: project.completed
                                    ? COLOR_COMPLETED
                                    : project.active
                                      ? COLOR_ACTIVE_STATUS
                                      : COLOR_INACTIVE_STATUS,
                                }}
                              />
                            </TableCell>

                            <TableCell>
                              <img
                                src={
                                  project.previewImageUrl ||
                                  "https://picsum.dev/300/200"
                                }
                                alt={project.name}
                                className="w-16 h-8 object-cover rounded"
                                onError={(e) => {
                                  e.target.src = "https://picsum.dev/300/200";
                                }}
                              />
                            </TableCell>

                            <TableCell className="max-w-[150px] truncate font-medium">
                              {project.name}
                            </TableCell>
                            <TableCell>{project.year}</TableCell>
                            <TableCell>{project.category}</TableCell>
                            <TableCell>{project.subCategory}</TableCell>
                            <TableCell>{project.createdAt?.slice(0, 10)}</TableCell>
                            <TableCell>{project.updatedAt?.slice(0, 10)}</TableCell>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>

            </DragDropContext>

          </table>
        )}
      </div>
    </div>
  );
};

const ProjectTableSkeleton = ({ TableHeaderCell, TableCell }) => {
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </TableCell>
      <TableCell className="text-center">
        <div className="h-3 w-3 bg-gray-200 rounded-full mx-auto"></div>
      </TableCell>
      <TableCell>
        <div className="h-8 w-16 bg-gray-200 rounded"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </TableCell>
    </tr>
  );

  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead
        className="sticky top-0 z-10"
        style={{ backgroundColor: COLOR_HEADER_BG }}
      >
        <tr>
          <TableHeaderCell>Order</TableHeaderCell>
          <TableHeaderCell className="w-[40px] text-center">
            Status
          </TableHeaderCell>
          <TableHeaderCell>Image</TableHeaderCell>
          <TableHeaderCell>Project Name</TableHeaderCell>
          <TableHeaderCell>Year</TableHeaderCell>
          <TableHeaderCell>Category</TableHeaderCell>
          <TableHeaderCell>Subcategory</TableHeaderCell>
          <TableHeaderCell>Date Created</TableHeaderCell>
          <TableHeaderCell>Last Modified</TableHeaderCell>
        </tr>
      </thead>
      <tbody>
        {[...Array(8)].map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </tbody>
    </table>
  );
};

export default MiddleArea;
