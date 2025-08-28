import React from "react";
import { Pencil, Trash2, User, X } from "lucide-react";

const SidebarRight = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <aside className="flex flex-col h-screen w-[400px] bg-[#F9F8F7] text-[#333] overflow-y-auto shadow-lg">

      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-black transition"
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>
      </div>


      <div className="px-6">
        <img
          src={project.image || "https://picsum.dev/300/200"}
          alt={project.name}
          className="w-full h-60 object-cover rounded-xl shadow-sm"
        />
      </div>


      <div className="flex-1 px-6 py-6 space-y-6">
        <h2 className="text-xl font-bold break-words whitespace-normal max-w-[320px]">
          {project.name}
        </h2>


        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <span className="text-gray-500 font-medium">LOCATION</span>
          <span>{project.location || "Location"}</span>

          <span className="text-gray-500 font-medium">YEAR</span>
          <span>{project.year || "2000"}</span>

          <span className="text-gray-500 font-medium">STATUS</span>
          <span>{project.status || "Complete"}</span>

          <span className="text-gray-500 font-medium">CATEGORY</span>
          <span>{project.category || "Category"}</span>

          <span className="text-gray-500 font-medium">SUB - CATEGORY</span>
          <span>{project.subcategory || "Sub - Category"}</span>

          <span className="text-gray-500 font-medium">CLIENT</span>
          <span className="break-words">
            {project.client || "XYZ (allow flow to new line)"}
          </span>

          <span className="text-gray-500 font-medium">COLLABORATORS</span>
          <span className="break-words">
            {project.collaborators || "XYZ (allow flow to new line)"}
          </span>

          <span className="text-gray-500 font-medium">TEAM</span>
          <span className="break-words">
            {project.team || "Team (allow flow to new line)"}
          </span>

          <span className="text-gray-500 font-medium">TAGS</span>
          <div className="flex flex-wrap gap-2">
            {(project.tags || ["Tag 1", "Tag 2", "Tag 3"]).map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs bg-gray-200 rounded-md text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>


        <hr className="border-gray-300" />


        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <span className="text-gray-500 font-medium">DATE CREATED</span>
          <span>
            {project.created || "DD - MM - YYYY"}{" "}
            <span className="ml-2 italic text-gray-600">20:00</span>
          </span>

          <span className="text-gray-500 font-medium">DATE MODIFIED</span>
          <span>
            {project.modified || "DD - MM - YYYY"}{" "}
            <span className="ml-2 italic text-gray-600">20:00</span>
          </span>

          <span className="text-gray-500 font-medium">MODIFIED BY</span>
          <span className="flex items-center gap-2">
            <User size={16} /> {project.editedBy || "User Name"}
          </span>
        </div>
      </div>


      <div className="px-6 py-4 flex gap-3 border-t border-gray-200">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-500 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition">
          <Pencil size={16} />
          Modify Project
        </button>
        <button className="px-4 py-2 border border-[#6E6A6B] rounded-lg text-[#6E6A6B] hover:bg-red-100 transition">
          <Trash2 size={18} />
        </button>
      </div>
    </aside>
  );
};

export default SidebarRight;
