import React, { useEffect, useState } from "react";
import { Pencil, Trash2, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import projectApi from "../../services/projectApi"; // Import your API helper

// Custom Confirmation Component for deletion
const ConfirmDeletionToast = ({ closeToast, project, onDeleteConfirm }) => {
  const handleConfirm = () => {
    onDeleteConfirm();
    closeToast(); // Close the toast after confirmation
  };

  return (
    <div className="p-2">
      <p className="font-semibold text-sm mb-3">
        Are you sure you want to delete{" "}
        <span className="text-red-600 font-bold">"{project.name}"</span>?
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={closeToast}
          className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  );
};

const SidebarRight = ({ project, onClose, onDeleteSuccess, currentUser }) => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);

  if (!project) return null;

  // Fetch all tags from backend (optional)
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await projectApi.getTags();
        setTags(data);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };
    fetchTags();
  }, []);

  // Delete project
  const executeDelete = async () => {
    try {
      await projectApi.deleteProject(project._id);
      toast.success("Project deleted successfully! 🎉");
      if (onDeleteSuccess) onDeleteSuccess();
      onClose();
    } catch (err) {
      console.error("Deletion failed:", err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to delete project. Please check the server."
      );
    }
  };

  // Show delete confirmation toast
  const handleDelete = () => {
    toast.warn(
      ({ closeToast }) => (
        <ConfirmDeletionToast
          closeToast={closeToast}
          project={project}
          onDeleteConfirm={executeDelete}
        />
      ),
      { position: "top-center", autoClose: false, closeOnClick: false, draggable: false }
    );
  };

  // Navigate to edit project page
  const handleModify = () => {
    navigate(`/admin/dashboard/projects/edit/${project._id}`);
    onClose();
  };

  return (
    <aside className="flex flex-col h-screen w-[400px] bg-[#F9F8F7] text-[#333] overflow-y-auto shadow-lg">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-gray-600 hover:text-black transition">
          <X size={22} />
        </button>
      </div>

      <div className="px-6">
        <img
          src={project.previewImageUrl || "https://picsum.dev/300/200"}
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
          <span>{project.subCategory || "Sub - Category"}</span>

          <span className="text-gray-500 font-medium">CLIENT</span>
          <span className="break-words">{project.client || "XYZ"}</span>

          <span className="text-gray-500 font-medium">COLLABORATORS</span>
          <span className="break-words">{project.collaborators || "XYZ"}</span>

          <span className="text-gray-500 font-medium">TEAM</span>
          <span className="break-words">{project.projectTeam || "Team"}</span>

          <span className="text-gray-500 font-medium">TAGS</span>
          <div className="flex flex-wrap gap-2">
            {(project.tags || []).map((tag, i) => (
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
            {project.createdAt
              ? new Date(project.createdAt).toLocaleDateString()
              : "DD-MM-YYYY"}
          </span>

          <span className="text-gray-500 font-medium">DATE MODIFIED</span>
          <span>
            {project.updatedAt
              ? new Date(project.updatedAt).toLocaleDateString()
              : "DD-MM-YYYY"}
          </span>

          <span className="text-gray-500 font-medium">MODIFIED BY</span>
          <span className="flex items-center gap-2">
            <User size={16} /> {currentUser?.name || project.editedBy || "User Name"}
          </span>
        </div>
      </div>

      <div className="px-6 py-4 flex gap-3 border-t border-gray-200">
        <button
          onClick={handleModify}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-500 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          <Pencil size={16} /> Modify Project
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 border border-[#6E6A6B] rounded-lg text-[#6E6A6B] hover:bg-red-100 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </aside>
  );
};

export default SidebarRight;
