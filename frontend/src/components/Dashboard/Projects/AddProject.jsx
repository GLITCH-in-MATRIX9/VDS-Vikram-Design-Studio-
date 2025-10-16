import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaGripVertical, FaTrash } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import projectApi from "../../../services/projectApi";

const MAX_TEXT_LENGTH = 700;

// Hardcoded list for the new Project Leader dropdown
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

const AddProject = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    year: "",
    status: "",
    category: "",
    subCategory: "",
    client: "",
    collaborators: "",
    // 🚨 1. New field added, initialized as an array for multi-select
    projectLeaders: [],
    projectTeam: "",
    tags: [],
    keyDate: new Date().toISOString().slice(0, 10),
    previewImageUrl: "",
  });

  const [sections, setSections] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [savedTags, setSavedTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  // 🚨 State for the Project Leader dropdown
  const [showLeaderDropdown, setShowLeaderDropdown] = useState(false);

  useEffect(() => {
    // Fetch previously saved tags from backend
    const fetchSavedTags = async () => {
      try {
        const projects = await projectApi.getProjects();
        const tags = new Set();
        projects.forEach((p) =>
          p.tags.forEach((tag) => tags.add(tag.toUpperCase()))
        );
        setSavedTags(Array.from(tags));
      } catch (err) {
        console.error("Failed to fetch saved tags:", err);
        // Fallback for demonstration if API fails:
        setSavedTags([
          "SUSTAINABLE",
          "GREEN_BUILDING",
          "LOW_COST",
          "MODULAR_DESIGN",
          "HERITAGE_PRESERVATION",
        ]);
      }
    };

    fetchSavedTags();

    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  const handleCategoryChange = (e) => {
    const category = e.target.value.toUpperCase();
    setSelectedCategory(category);
    setAvailableSubCategories(filterOptions[category] || []);
    setFormData((prev) => ({ ...prev, category, subCategory: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  // 🚨 New handler for Project Leader multi-select
  const handleLeaderToggle = (leader) => {
    setFormData((prev) => {
      const leaders = prev.projectLeaders;
      if (leaders.includes(leader)) {
        // Remove leader if already selected
        return { ...prev, projectLeaders: leaders.filter((l) => l !== leader) };
      } else {
        // Add leader
        return { ...prev, projectLeaders: [...leaders, leader] };
      }
    });
  };

  const handleAddTag = (tag = null) => {
    const newTag = (tag || tagInput).trim().toUpperCase();
    if (!newTag || formData.tags.includes(newTag)) return;

    setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));

    if (!savedTags.includes(newTag)) {
      setSavedTags((prev) => [...prev, newTag]);
    }

    setTagInput("");
    setShowDropdown(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleAddText = () =>
    setSections((prev) => [...prev, { type: "text", content: "" }]);
  const handleAddImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setSections((prev) => [
        ...prev,
        { type: "image", content: reader.result },
      ]);
    reader.readAsDataURL(file);
  };
  const handleAddGif = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setSections((prev) => [...prev, { type: "gif", content: reader.result }]);
    reader.readAsDataURL(file);
  };

  const handleContentChange = (index, value) => {
    if (value.length <= MAX_TEXT_LENGTH) {
      setSections((prev) => {
        const copy = [...prev];
        copy[index].content = value;
        return copy;
      });
    }
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

  const handlePreviewChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewFile(file);
    if (previewURL) URL.revokeObjectURL(previewURL);
    setPreviewURL(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(formData).forEach((key) => {
      // Tags and ProjectLeaders are arrays, so they should be stringified
      if (key === "tags" || key === "projectLeaders")
        fd.append(key, JSON.stringify(formData[key]));
      else fd.append(key, formData[key]);
    });
    fd.append("sections", JSON.stringify(sections));
    if (previewFile) fd.append("previewImage", previewFile);

    try {
      // NOTE: Placeholder for API call
      const res = await projectApi.createProject(fd);
      console.log("Submitting Project Data:", {
        formData,
        sections,
        previewFile: previewFile?.name,
      });
      alert("Project creation simulated successfully!");
      // console.log(res.data);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div className="flex-1 p-6 bg-[#F5F1EE]">
      <nav className="text-sm font-medium mb-4 text-[#722F37]">
        <span>Projects</span> &gt; <span>Add Project</span>
      </nav>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded p-6 flex flex-col gap-6"
      >
        <div className="grid grid-cols-2 gap-6 items-start">
          {/* Mandatory Fields */}
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-lg text-[#454545]">
              1. Mandatory Fields
            </h2>

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
                onChange={handleChange}
                className="border p-2 rounded w-full border-[#C9BEB8]"
                disabled={!availableSubCategories.length}
              >
                <option value="">Select Sub-Category</option>
                {availableSubCategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              placeholder="Client *"
              className="border p-2 rounded w-full border-[#C9BEB8]"
              autoComplete="off"
              required
            />

            <input
              type="text"
              name="collaborators"
              value={formData.collaborators}
              onChange={handleChange}
              placeholder="Collaborators *"
              className="border p-2 rounded w-full border-[#C9BEB8]"
              autoComplete="off"
              required
            />

            {/* 🚨 NEW PROJECT LEADER FIELD (Multi-select dropdown) 🚨 */}
            <div className="relative">
              <div
                className="border p-2 rounded w-full border-[#C9BEB8] cursor-pointer bg-white"
                onClick={() => setShowLeaderDropdown(!showLeaderDropdown)}
              >
                {formData.projectLeaders.length > 0
                  ? formData.projectLeaders.join(", ")
                  : "Select Project Leader(s) *"}
              </div>

              {showLeaderDropdown && (
                <div className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                  {PROJECT_LEADERS_OPTIONS.map((leader) => (
                    <div
                      key={leader}
                      // Use onMouseDown to prevent dropdown closing when clicking on an option
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleLeaderToggle(leader);
                      }}
                      className={`p-2 cursor-pointer text-sm flex justify-between items-center ${
                        formData.projectLeaders.includes(leader)
                          ? "bg-[#F1E4DF] font-semibold"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {leader}
                      {formData.projectLeaders.includes(leader) && (
                        <span className="text-[#722F37] text-xl">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* Hidden input to ensure form validation if needed, though state is primary here */}
              <input
                type="hidden"
                name="projectLeaders"
                value={formData.projectLeaders.join(",")}
                required
              />
            </div>
            {/* 🚨 END NEW PROJECT LEADER FIELD 🚨 */}

            <input
              type="text"
              name="projectTeam"
              value={formData.projectTeam}
              onChange={handleChange}
              placeholder="Project Team *"
              className="border p-2 rounded w-full border-[#C9BEB8]"
              autoComplete="off"
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border p-2 rounded w-full border-[#C9BEB8]"
                required
              >
                <option value="">Select Status *</option>
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="IN DESIGN">IN DESIGN</option>
              </select>
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
          </div>

          {/* Preview Upload */}
          <div className="flex flex-col gap-2 items-center justify-center border p-4 rounded border-[#C9BEB8]">
            <p className="text-xs text-gray-400 mb-2 text-center">
              ⚠️ Files must not be greater than 900 KB.
            </p>
            <label
              htmlFor="preview-upload"
              className="flex items-center gap-2 px-4 py-2 bg-[#722F37] text-white rounded-md cursor-pointer hover:bg-[#632932] transition"
            >
              <FiUpload />
              <span className="text-sm font-medium">Upload Preview</span>
              <input
                id="preview-upload"
                type="file"
                accept="image/*,.gif"
                onChange={handlePreviewChange}
                className="hidden"
              />
            </label>
            {previewURL && (
              <img
                src={previewURL}
                alt="Preview"
                className="w-auto h-68 object-cover rounded mt-2"
              />
            )}
          </div>
        </div>

        {/* Tags Input and Dropdown */}
        <div>
          <h2 className="font-bold text-lg mb-2 text-[#454545]">
            2. Project Tags
          </h2>
          <div className="relative">
            {/* Input for adding new tags */}
            <div className="flex border rounded border-[#C9BEB8] overflow-hidden">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={(e) => {
                  setTimeout(() => setShowDropdown(false), 200);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tags..."
                className="p-2 flex-grow focus:outline-none"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => handleAddTag()}
                className="px-4 py-2 bg-[#722F37] text-white hover:bg-[#632932] text-sm font-medium"
              >
                Add
              </button>
            </div>

            {/* Dropdown for suggested tags */}
            {showDropdown && tagInput.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-t-0 rounded-b shadow-lg max-h-60 overflow-y-auto">
                {savedTags
                  .filter(
                    (tag) =>
                      tag.includes(tagInput.toUpperCase()) &&
                      !formData.tags.includes(tag)
                  )
                  .sort()
                  .slice(0, 10)
                  .map((tag) => (
                    <div
                      key={tag}
                      onMouseDown={() => {
                        handleAddTag(tag);
                        setTagInput("");
                        setShowDropdown(false);
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                    >
                      {tag}
                    </div>
                  ))}
              </div>
            )}

            {/* Display selected tags */}
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-[#F1E4DF] text-[#722F37] text-xs font-medium px-3 py-1 rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-[#722F37] hover:text-[#5B252C]"
                    aria-label={`Remove tag ${tag}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Key Date */}
        <div>
          <label
            htmlFor="keyDate"
            className="block text-sm font-medium text-[#454545] mb-1"
          >
            Key Date
          </label>
          <input
            id="keyDate"
            type="date"
            name="keyDate"
            value={formData.keyDate}
            readOnly
            className="border p-2 rounded w-full border-[#C9BEB8] bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Sections */}
        <div className="mt-6">
          <h2 className="font-bold text-lg mb-4 text-[#454545]">
            3. Content Sections (Files must not be greater than 900kb)
          </h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {sections.map((section, index) => (
                    <Draggable
                      key={`section-${index}`}
                      draggableId={`section-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="mb-4 border rounded p-4 border-[#C9BEB8] bg-white flex flex-col gap-2"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-[#454545]">
                              {section.type === "text"
                                ? "Text Section"
                                : `${
                                    section.type.charAt(0).toUpperCase() +
                                    section.type.slice(1)
                                  } Section`}
                            </h3>
                            <div className="flex gap-2 items-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveContent(index)}
                                className="text-[#C94A4A] hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                              <span
                                {...provided.dragHandleProps}
                                className="cursor-move text-gray-400"
                              >
                                <FaGripVertical />
                              </span>
                            </div>
                          </div>

                          {section.type === "text" ? (
                            <>
                              <textarea
                                className="border p-2 rounded w-full border-[#C9BEB8] min-h-[100px]"
                                value={section.content}
                                placeholder="Enter text"
                                onChange={(e) =>
                                  handleContentChange(index, e.target.value)
                                }
                                maxLength={MAX_TEXT_LENGTH}
                              />
                              <div className="text-right text-xs text-gray-500">
                                {section.content.length} / {MAX_TEXT_LENGTH}
                              </div>
                            </>
                          ) : (
                            <div className="flex justify-center w-full">
                              <img
                                src={section.content}
                                alt={`${section.type} content`}
                                className="max-h-40 rounded object-cover"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex gap-2 mt-4 justify-start">
            <button
              type="button"
              onClick={handleAddText}
              className="px-4 py-2 text-sm rounded bg-[#454545] text-white hover:bg-[#666666]"
            >
              + Add Text
            </button>
            <label className="px-4 py-2 text-sm rounded bg-[#454545] text-white cursor-pointer hover:bg-[#666666]">
              + Add Image
              <input
                type="file"
                accept="image/*,.gif"
                className="hidden"
                onChange={(e) => handleAddImage(e.target.files[0])}
              />
            </label>
            <label className="px-4 py-2 text-sm rounded bg-[#454545] text-white cursor-pointer hover:bg-[#666666]">
              + Add GIF
              <input
                type="file"
                accept=".gif"
                className="hidden"
                onChange={(e) => handleAddGif(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-[#722F37] text-white rounded hover:bg-[#632932] transition"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
};

export default AddProject;
