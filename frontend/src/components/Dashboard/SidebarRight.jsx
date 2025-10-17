import React, { useEffect, useState, useContext } from "react";
import { Pencil, Trash2, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import projectApi from "../../services/projectApi";
import { AuthContext } from "../../context/authContext";

// Custom Confirmation Component for deletion
const ConfirmDeletionToast = ({ closeToast, project, onDeleteConfirm }) => {
  const handleConfirm = () => {
    onDeleteConfirm();
    closeToast();
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
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  );
};

const SidebarRight = ({ project, onClose, onDeleteSuccess }) => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const { user: currentUser } = useContext(AuthContext);

  if (!project) return null;

  // Fetch all tags from backend
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
        err?.response?.data?.message || "Failed to delete project. Please check the server."
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

  // Navigate to edit project page WITHOUT modifying backend
  const handleModify = () => {
    navigate(`/admin/dashboard/projects/edit/${project._id}`);
    onClose();
  };

  return (
    <aside className="flex flex-col h-screen w-[400px] bg-[#F9F8F7] text-[#333] overflow-y-auto shadow-lg relative">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-gray-600 hover:text-black transition">
          <X size={22} />
        </button>
      </div>

      <div className="px-6">
        <img
          src={project.previewImageUrl || "https://picsum.photos/300/200"}
          alt={project.name}
          className="w-full h-60 object-cover rounded-xl shadow-sm"
        />
      </div>

      <div className="flex-1 px-6 py-6 space-y-6">
        <h2 className="text-xl font-semibold text-[#3e3c3c] font-sora break-words whitespace-normal max-w-[320px]">
          {project.name}
        </h2>

        <div className="grid grid-cols-2 gap-y-4 text-xs">
          <span className="text-[#6E6A6B] font-medium">LOCATION</span>
          <span className="text-[#474545] uppercase">{project.location || "Location"}</span>

          <span className="text-[#6E6A6B] font-medium">YEAR</span>
          <span className="text-[#474545] uppercase">{project.year || "2000"}</span>

          <span className="text-[#6E6A6B] font-medium">STATUS</span>
          <span className="text-[#474545] uppercase">{project.status || "Complete"}</span>

          <span className="text-[#6E6A6B] font-medium">CATEGORY</span>
          <span className="text-[#474545] uppercase">{project.category || "Category"}</span>

          <span className="text-[#6E6A6B] font-medium">SUB - CATEGORY</span>
          <span className="text-[#474545] uppercase">{project.subCategory || "Sub - Category"}</span>

          <span className="text-[#6E6A6B] font-medium">CLIENT</span>
          <span className="break-words text-[#474545] uppercase">{project.client || "XYZ"}</span>

          <span className="text-[#6E6A6B] font-medium">COLLABORATORS</span>
          <span className="break-words text-[#474545] uppercase">{project.collaborators || "XYZ"}</span>

          <span className="text-[#6E6A6B] font-medium">TEAM</span>
          <span className="break-words text-[#474545] uppercase">{project.projectTeam || "Team"}</span>

          <span className="text-[#6E6A6B] font-medium">TAGS</span>
          <div className="flex flex-wrap gap-2">
            {(project.tags || []).map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-[#B13024] rounded-md text-[#F8F7F8]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <hr className="border-gray-300" />

        <div className="grid grid-cols-2 gap-y-4 text-xs uppercase">
          <span className="text-[#6E6A6B] font-medium">DATE CREATED</span>
          <span className="text-[#474545]">
            {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "DD-MM-YYYY"}
          </span>

          <span className="text-[#6E6A6B] font-medium">DATE MODIFIED</span>
          <span className="text-[#474545]">
            {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "DD-MM-YYYY"}
          </span>

          {/* "Modified By" removed */}
        </div>
      </div>

      <div className="px-6 py-4 flex gap-3 border-t border-gray-200 sticky bg-[#F9F8F7] bottom-0">
        <button
          onClick={handleModify}
          className="flex-1 flex items-center justify-center cursor-pointer font-medium gap-2 px-4 py-2 border border-[#6E6A6B] rounded-lg text-[#474545] text-xs uppercase hover:bg-[#E6E2E088] transition"
        >
          <Pencil size={14} /> Modify Project
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 border border-[#6E6A6B] cursor-pointer rounded-lg text-[#6E6A6B] font-medium hover:text-[#B13024] hover:bg-red-100 hover:border-[#B13024] transition"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </aside>
  );
};

export default SidebarRight;
