import React, { useState } from "react";
import AddProject from "./AddProject";
import { FiSearch, FiSettings, FiPlus, FiArrowLeft, FiMoreVertical } from "react-icons/fi";


const MiddleArea = ({ onProjectClick }) => {
  const [showAddProject, setShowAddProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const projects = [
    {
      id: "001",
      name: "Project Name 1 ",
      year: "2000",
      category: "Category",
      subcategory: "Subcategory",
      created: "00-00-0000",
      modified: "00-00-0000",
      image: "https://picsum.photos/300/200?random=1",
      active: true,
    },
    {
      id: "002",
      name: "Project Name 2",
      year: "2001",
      category: "Category",
      subcategory: "Subcategory",
      created: "00-00-0000",
      modified: "00-00-0000",
      image: "https://picsum.photos/300/200?random=2",
      active: false,
    },
    {
      id: "003",
      name: "Project Name 3",
      year: "2002",
      category: "Category",
      subcategory: "Subcategory",
      created: "00-00-0000",
      modified: "00-00-0000",
      image: "https://picsum.photos/300/200?random=3",
      active: true,
    },
    {
      id: "004",
      name: "Project Name 4",
      year: "2003",
      category: "Category",
      subcategory: "Subcategory",
      created: "00-00-0000",
      modified: "00-00-0000",
      image: "https://picsum.photos/300/200?random=4",
      active: false,
    },
    {
      id: "005",
      name: "Project Name 5",
      year: "2004",
      category: "Category",
      subcategory: "Subcategory",
      created: "00-00-0000",
      modified: "00-00-0000",
      image: "https://picsum.photos/300/200?random=5",
      active: true,
    },
    {
      id: "006",
      name: "Project Name 6",
      year: "2005",
      category: "Category",
      subcategory: "Subcategory",
      created: "00-00-0000",
      modified: "00-00-0000",
      image: "https://picsum.photos/300/200?random=6",
      active: false,
    },
    {
      id: "007",
      name: "Project Name 7",
      year: "2006",
      category: "Category",
      subcategory: "Subcategory",
      created: "00-00-0000",
      modified: "00-00-0000",
      image: "https://picsum.photos/300/200?random=7",
      active: true,
    },
    {
      id: "008",
      name: "Project Name 8",
      year: "2007",
      category: "Category",
      subcategory: "Subcategory",
      created: "00-00-0000",
      modified: "00-00-0000",
      image: "https://picsum.photos/300/200?random=8",
      active: false,
    },
    {
      id: "009",
      name: "Project Name 9",
      year: "2008",
      category: "Category",
      subcategory: "Subcategory",
      created: "00-00-0000",
      modified: "00-00-0000",
      image: "https://picsum.photos/300/200?random=9",
      active: true,
    },
    {
      id: "010",
      name: "Project Name 10",
      year: "2009",
      category: "Category",
      subcategory: "Subcategory",
      created: "00-00-0000",
      modified: "00-00-0000",
      image: "https://picsum.photos/300/200?random=10",
      active: false,
    },
    {
      id: "011",
      name: "Project Name 11",
      year: "2010",
      category: "Category",
      subcategory: "Subcategory",
      created: "00-00-0000",
      modified: "00-00-0000",
      image: "https://picsum.photos/300/200?random=11",
      active: true,
    },
    {
      id: "012",
      name: "Project Name 12",
      year: "2011",
      category: "Category",
      subcategory: "Subcategory",
      created: "00-00-0000",
      modified: "00-00-0000",
      image: "https://picsum.photos/300/200?random=12",
      active: false,
    },
    {
      id: "013",
      name: "Project Name 13",
      year: "2012",
      category: "Category",
      subcategory: "Subcategory",
      created: "00-00-0000",
      modified: "00-00-0000",
      image: "https://picsum.photos/300/200?random=13",
      active: true,
    },
    {
      id: "014",
      name: "Project Name 14",
      year: "2013",
      category: "Category",
      subcategory: "Subcategory",
      created: "00-00-0000",
      modified: "00-00-0000",
      image: "https://picsum.photos/300/200?random=14",
      active: false,
    },
    {
      id: "015",
      name: "Project Name 15",
      year: "2014",
      category: "Category",
      subcategory: "Subcategory",
      created: "00-00-0000",
      modified: "00-00-0000",
      image: "https://picsum.photos/300/200?random=15",
      active: true,
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-6 bg-white">

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {!showAddProject && (
          <div className="relative w-full md:w-1/2">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 px-10 py-2 w-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div className="flex gap-3">
          {!showAddProject && (
            <button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition text-sm"
              title="Filter options"
            >
              <FiSettings /> Filter
            </button>
          )}
          <button
            onClick={() => setShowAddProject((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-white text-sm transition ${showAddProject
              ? "bg-gray-600 hover:bg-gray-700"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {showAddProject ? (
              <>
                <FiArrowLeft /> Back to Projects
              </>
            ) : (
              <>
                <FiPlus /> Add Project
              </>
            )}
          </button>
        </div>
      </div>


      <div className="flex-1 overflow-y-auto border-gray-200 max-h-[80vh]">
        {showAddProject ? (
          <AddProject />
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
              {projects
                .filter((p) =>
                  p.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((project) => (
                  <tr
                    key={project.id}
                    className={`cursor-pointer transition ${project.active
                      ? "hover:bg-blue-50"
                      : "opacity-50 pointer-events-none"
                      }`}
                    onClick={() => onProjectClick && onProjectClick(project)}
                  >

                    <td className="p-3 border-b border-gray-200">

                      {project.id}
                    </td>


                    <td className="p-3 border-b border-gray-200">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${project.active ? "bg-green-500" : "bg-red-500"
                          }`}
                      ></span>
                    </td>

                    <td className="p-3 border-b border-gray-200">
                      <img
                        src={project.image}
                        alt={project.name}
                        className={`w-16 h-10 object-cover rounded ${project.active ? "" : "grayscale"
                          }`}
                      />
                    </td>


                    <td className="p-3 border-b border-gray-200 max-w-[200px] truncate whitespace-nowrap overflow-hidden">
                      {project.name}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {project.year}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {project.category}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {project.subcategory}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {project.created}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {project.modified}
                    </td>
                  </tr>
                ))}


              {searchTerm &&
                projects.filter((p) =>
                  p.name.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
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
