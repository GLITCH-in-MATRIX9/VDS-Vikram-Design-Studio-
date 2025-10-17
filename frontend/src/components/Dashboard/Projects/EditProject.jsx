// EditProject.jsx
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaGripVertical, FaTrash } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import projectApi from "../../../services/projectApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_TEXT_LENGTH = 700;

const PROJECT_LEADERS_OPTIONS = [
  "VIKRAMM B SHROFF",
  "POOZA AGARWAL",
  "NAMMAN SHROFF",
];

const filterOptions = {
  EDUCATION: [
    "SCHOOLS",
    "TRAINING INSTITUTIONS/CENTRES",
    "RESEARCH CENTRES",
    "COLLEGES & UNIVERSITIES",
  ],
  HEALTHCARE: ["HOSPITALS", "MEDICAL COLLEGES", "DIAGNOSTIC LABS", "CLINICS"],
  CIVIC: [
    "AUDITORIUMS",
    "TOWN HALLS",
    "POLICE STATIONS",
    "PUBLIC TOILETS & AMENITIES",
  ],
  WORKSPACE: ["GOVERNMENT OFFICES", "CORPORATE OFFICES", "RESEARCH CENTRES"],
  SPORTS: ["STADIUMS", "SPORTS COMPLEX", "MULTIPURPOSE SPORTS HALLS"],
  CULTURE: ["RELIGIOUS", "MEMORIALS", "CULTURAL COMPLEX", "MUSEUMS"],
  RESIDENTIAL: [
    "STAFF QUARTERS",
    "PRIVATE VILLAS",
    "PRIVATE APARTMENTS",
    "HOUSING",
    "HOSTELS",
    "GUEST HOUSES",
  ],
  HOSPITALITY: ["HOTELS", "RESORTS", "RESTAURANTS", "TOURISM LODGES"],
  RETAIL: [
    "SHOWROOMS",
    "SHOPPING COMPLEX",
    "DEPARTMENTAL STORES",
    "MULTIPLEXES",
  ],
};

const TAG_OPTIONS = Object.keys(filterOptions);

const STATES_AND_UTS = [
  "ANDHRA PRADESH",
  "ARUNACHAL PRADESH",
  "ASSAM",
  "BIHAR",
  "CHHATTISGARH",
  "GOA",
  "GUJARAT",
  "HARYANA",
  "HIMACHAL PRADESH",
  "JHARKHAND",
  "KARNATAKA",
  "KERALA",
  "MADHYA PRADESH",
  "MAHARASHTRA",
  "MANIPUR",
  "MEGHALAYA",
  "MIZORAM",
  "NAGALAND",
  "ODISHA",
  "PUNJAB",
  "RAJASTHAN",
  "SIKKIM",
  "TAMIL NADU",
  "TELANGANA",
  "TRIPURA",
  "UTTAR PRADESH",
  "UTTARAKHAND",
  "WEST BENGAL",
  "ANDAMAN AND NICOBAR ISLANDS",
  "CHANDIGARH",
  "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
  "DELHI",
  "JAMMU AND KASHMIR",
  "LADAKH",
  "LAKSHADWEEP",
  "PUDUCHERRY",
];

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    year: "",
    status: "",
    category: "",
    subCategory: "",
    client: "",
    collaborators: "",
    projectLeaders: [],
    projectTeam: "",
    tags: [],
    keyDate: "",
    previewImageUrl: "",
  });

  const [nextNewSectionId, setNextNewSectionId] = useState(0);
  const [sections, setSections] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [showLeaderDropdown, setShowLeaderDropdown] = useState(false);

  // Tag input state
  const [tagInput, setTagInput] = useState("");
  const [savedTags, setSavedTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch project data & saved tags
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await projectApi.getProjectById(id);
        setFormData({
          name: project.name || "",
          location: project.location || "",
          year: project.year ? project.year.toString() : "",
          status: project.status ? project.status.toUpperCase() : "",
          category: project.category || "",
          subCategory: project.subCategory || "",
          client: project.client || "",
          collaborators: project.collaborators || "",
          projectLeaders: project.projectLeaders || [],
          projectTeam: project.projectTeam || "",
          tags: project.tags || [],
          keyDate: project.keyDate
            ? new Date(project.keyDate).toISOString().slice(0, 10)
            : "",
          previewImageUrl: project.previewImageUrl || "",
        });

        setSelectedCategory(project.category || "");
        setAvailableSubCategories(filterOptions[project.category] || []);

        const sectionsWithKeys = (project.sections || []).map(
          (section, index) => ({
            ...section,
            tempId: `fetched-${index}-${Date.now() + index}`,
          })
        );

        setSections(sectionsWithKeys);
        setPreviewURL(project.previewImageUrl || null);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        toast.error("Failed to fetch project details.", { autoClose: 3000 });
      }
    };

    const fetchSavedTags = async () => {
      try {
        const projects = await projectApi.getProjects();
        const tags = new Set();
        projects.forEach((p) =>
          (p.tags || []).forEach((tag) => tags.add(tag.toUpperCase()))
        );
        setSavedTags(Array.from(tags));
      } catch (err) {
        console.error("Failed to fetch saved tags:", err);
        setSavedTags([
          "SUSTAINABLE",
          "GREEN_BUILDING",
          "LOW_COST",
          "MODULAR_DESIGN",
          "HERITAGE_PRESERVATION",
        ]);
      }
    };

    fetchProject();
    fetchSavedTags();
  }, [id]);

  // ----- Handlers -----
  const handleCategoryChange = (e) => {
    const category = e.target.value.toUpperCase();
    setSelectedCategory(category);
    setAvailableSubCategories(filterOptions[category] || []);
    setFormData((prev) => ({ ...prev, category, subCategory: "" }));
  };

  const handleSubCategoryChange = (e) => {
    const subCategory = e.target.value.toUpperCase();
    setFormData((prev) => ({ ...prev, subCategory }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "year") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, year: numericValue }));
      return;
    }

    const upperCaseFields = [
      "name",
      "client",
      "projectTeam",
      "collaborators",
      "location",
      "status",
      "subCategory",
    ];

    setFormData((prev) => ({
      ...prev,
      [name]: upperCaseFields.includes(name) ? value.toUpperCase() : value,
    }));
  };

  const handleLeaderToggle = (leader) => {
    setFormData((prev) => {
      const leaders = prev.projectLeaders;
      if (leaders.includes(leader)) {
        return { ...prev, projectLeaders: leaders.filter((l) => l !== leader) };
      } else {
        return { ...prev, projectLeaders: [...leaders, leader] };
      }
    });
  };

  const handleAddTag = (tag = null) => {
    const newTag = (tag || tagInput).trim().toUpperCase();
    if (!newTag || formData.tags.includes(newTag)) return;

    setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
    if (!savedTags.includes(newTag)) setSavedTags((prev) => [...prev, newTag]);

    setTagInput("");
    setShowDropdown(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddText = () => {
    setSections((prev) => [
      ...prev,
      { type: "text", content: "", tempId: `new-${nextNewSectionId}` },
    ]);
    setNextNewSectionId((prev) => prev + 1);
  };

  const uploadFileToBackend = async (file) => {
    if (!file) return null;
    try {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    } catch (err) {
      console.error("File upload failed:", err);
      toast.error("File upload failed. Max 900KB.");
      return null;
    }
  };

  const handleAddMedia = async (file, type) => {
    if (!file || file.size > 900 * 1024) {
      toast.error("File is too large! Max 900KB.");
      return;
    }

    const tempId = `new-${nextNewSectionId}`;
    setNextNewSectionId((prev) => prev + 1);

    const localUrl = URL.createObjectURL(file);
    const tempSection = { type, content: localUrl, tempId };
    setSections((prev) => [...prev, tempSection]);

    const uploadedUrl = await uploadFileToBackend(file);
    if (uploadedUrl) {
      setSections((prev) =>
        prev.map((s) => (s.tempId === tempId ? { type, content: uploadedUrl, tempId } : s))
      );
      URL.revokeObjectURL(localUrl);
    } else {
      setSections((prev) => prev.filter((s) => s.tempId !== tempId));
      URL.revokeObjectURL(localUrl);
    }
  };

  const handleAddImage = (e) => handleAddMedia(e.target.files[0], "image");
  const handleAddGif = (e) => handleAddMedia(e.target.files[0], "gif");

  const handleContentChange = (index, value) => {
    if (value.length > MAX_TEXT_LENGTH) return;
    setSections((prev) => {
      const newSections = [...prev];
      newSections[index].content = value;
      return newSections;
    });
  };

  const handleRemoveContent = (index) =>
    setSections((prev) => prev.filter((_, i) => i !== index));

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(sections);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setSections(reordered);
  };

  const handlePreviewChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 900 * 1024) {
      toast.error("Preview file too large! Max 900KB.");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreviewURL(localUrl);

    const uploadedUrl = await uploadFileToBackend(file);
    if (!uploadedUrl) {
      setPreviewURL(formData.previewImageUrl || null);
      return;
    }

    setFormData((prev) => ({ ...prev, previewImageUrl: uploadedUrl }));
    setPreviewURL(uploadedUrl);
    URL.revokeObjectURL(localUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanSections = sections.map(({ type, content }) => ({ type, content }));
    const data = { ...formData, sections: cleanSections };

    try {
      await projectApi.updateProject(id, data);
      toast.success("Project updated successfully! 🎉", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate("/admin/dashboard/projects"),
      });
    } catch (err) {
      console.error(err);
      const errorMessage =
        err?.response?.data?.message || "Failed to update project. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex-1 p-6 bg-[#F5F1EE]">
      <nav className="text-sm font-medium mb-4 text-[#722F37]">
        <span>Projects</span> &gt; <span>Edit Project</span>
      </nav>

      <form onSubmit={handleSubmit} className="bg-white border rounded p-6 flex flex-col gap-6">
        {/* --- Mandatory Fields --- */}
        <div className="grid grid-cols-2 gap-6 items-start">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-lg text-[#454545]">1. Mandatory Fields</h2>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Project Name *"
              className="border p-2 rounded w-full border-[#C9BEB8]"
              autoComplete="off"
              required
            />

            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="border p-2 rounded w-full border-[#C9BEB8]"
              required
            >
              <option value="">Select State/UT *</option>
              {STATES_AND_UTS.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <select
                name="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="border p-2 rounded w-full border-[#C9BEB8]"
                required
              >
                <option value="">Select Category *</option>
                {TAG_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleSubCategoryChange}
                className="border p-2 rounded w-full border-[#C9BEB8]"
                disabled={!availableSubCategories.length}
                required
              >
                <option value="">Select Subcategory *</option>
                {availableSubCategories.map((subCat) => (
                  <option key={subCat} value={subCat}>
                    {subCat}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Year *"
              className="border p-2 rounded w-full border-[#C9BEB8]"
              required
            />
          </div>

          {/* --- Preview Upload --- */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Preview Image / GIF</label>
            {previewURL && (
              <img src={previewURL} alt="Preview" className="w-full h-48 object-cover mb-2 rounded" />
            )}
            <input type="file" accept="image/*,gif/*" onChange={handlePreviewChange} />
          </div>
        </div>

        {/* --- Sections --- */}
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-lg text-[#454545]">2. Sections</h2>
          <div className="flex gap-2">
            <button type="button" onClick={handleAddText} className="px-3 py-1 border rounded hover:bg-[#EEE]">
              + Text
            </button>
            <label className="px-3 py-1 border rounded cursor-pointer hover:bg-[#EEE]">
              + Image
              <input type="file" accept="image/*" onChange={handleAddImage} className="hidden" />
            </label>
            <label className="px-3 py-1 border rounded cursor-pointer hover:bg-[#EEE]">
              + GIF
              <input type="file" accept="image/gif" onChange={handleAddGif} className="hidden" />
            </label>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {sections.map((sec, index) => (
                    <Draggable key={sec.tempId} draggableId={sec.tempId} index={index}>
                      {(provided) => (
                        <div
                          className="flex items-center gap-2 border p-2 rounded mb-2 bg-[#FAFAFA]"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div {...provided.dragHandleProps}>
                            <FaGripVertical />
                          </div>

                          {sec.type === "text" ? (
                            <textarea
                              value={sec.content}
                              onChange={(e) => handleContentChange(index, e.target.value)}
                              placeholder="Enter text..."
                              className="flex-1 p-2 border rounded border-[#C9BEB8]"
                              maxLength={MAX_TEXT_LENGTH}
                            />
                          ) : (
                            <img
                              src={sec.content}
                              alt={sec.type}
                              className="w-24 h-24 object-cover rounded"
                            />
                          )}

                          <button type="button" onClick={() => handleRemoveContent(index)}>
                            <FaTrash className="text-red-500" />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* --- Tags --- */}
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-lg text-[#454545]">3. Tags</h2>
          <div className="flex gap-2 flex-wrap">
            {formData.tags.map((tag) => (
              <div
                key={tag}
                className="bg-[#DDD] px-2 py-1 rounded flex items-center gap-1"
              >
                <span>{tag}</span>
                <button type="button" onClick={() => handleRemoveTag(tag)}>
                  <FaTrash className="text-red-500 text-xs" />
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value.toUpperCase())}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 250)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            placeholder="Add tag..."
            className="border p-2 rounded w-full border-[#C9BEB8]"
          />

          {showDropdown && (
            <div className="border rounded p-2 bg-white max-h-40 overflow-y-auto">
              {savedTags
                .filter(
                  (t) =>
                    t.includes(tagInput) && !formData.tags.includes(t)
                )
                .map((t) => (
                  <div
                    key={t}
                    className="p-1 cursor-pointer hover:bg-[#EEE]"
                    onMouseDown={() => handleAddTag(t)}
                  >
                    {t}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* --- Project Leaders --- */}
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-lg text-[#454545]">4. Project Leaders</h2>
          <div className="flex flex-wrap gap-2">
            {PROJECT_LEADERS_OPTIONS.map((leader) => (
              <button
                type="button"
                key={leader}
                onClick={() => handleLeaderToggle(leader)}
                className={`px-3 py-1 border rounded ${
                  formData.projectLeaders.includes(leader)
                    ? "bg-green-200"
                    : ""
                }`}
              >
                {leader}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-[#722F37] text-white rounded hover:bg-[#5C222B] mt-4"
        >
          Update Project
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default EditProject;
