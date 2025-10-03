// EditProject.jsx
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaGripVertical, FaTrash } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import projectApi from "../../services/projectApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_TEXT_LENGTH = 700;

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
const TAG_OPTIONS = Object.keys(filterOptions);

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
    projectTeam: "",
    tags: [],
    keyDate: "",
    previewImageUrl: "",
  });

  // Unique key for sections is crucial for mapping and dnd, so we'll use a unique ID generator
  // Note: Using a simple counter for new items, but keys from fetched data should be preserved if available
  const [nextNewSectionId, setNextNewSectionId] = useState(0); 
  const [sections, setSections] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableSubCategories, setAvailableSubCategories] = useState([]);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await projectApi.getProjectById(id);
        setFormData({
          name: project.name || "",
          location: project.location || "",
          year: project.year || "",
          status: project.status || "",
          category: project.category || "",
          subCategory: project.subCategory || "",
          client: project.client || "",
          collaborators: project.collaborators || "",
          projectTeam: project.projectTeam || "",
          tags: project.tags || [],
          keyDate: project.keyDate || "",
          previewImageUrl: project.previewImageUrl || "",
        });
        setSelectedCategory(project.category || "");
        setAvailableSubCategories(filterOptions[project.category] || []);
        
        // Assign temporary unique keys to fetched sections for use in D&D
        const sectionsWithKeys = (project.sections || []).map((section, index) => ({
            ...section,
            tempId: `fetched-${index}`,
        }));

        setSections(sectionsWithKeys);
        setPreviewURL(project.previewImageUrl || null);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        toast.error("Failed to fetch project details.", { autoClose: 3000 });
      }
    };
    fetchProject();
  }, [id]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setAvailableSubCategories(filterOptions[category] || []);
    setFormData((prev) => ({ ...prev, category, subCategory: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tags") {
      // FIX: Correctly append the new tag if it doesn't already exist
      setFormData((prev) => {
        if (value && !prev.tags.includes(value)) {
          return { ...prev, tags: [...prev.tags, value] };
        }
        return prev;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddText = () => {
    setSections((prev) => [...prev, { type: "text", content: "", tempId: `new-${nextNewSectionId}` }]);
    setNextNewSectionId(prev => prev + 1);
  }

  // Upload file to backend and get URL
  const uploadFileToBackend = async (file) => {
    if (!file) return null;
    try {
      // Log the file object before sending to confirm it's valid
      // console.log("Uploading file:", file);
      const res = await projectApi.uploadFile(file);
      return res.url; // backend should return { url }
    } catch (err) {
      console.error(err);
      toast.error("File upload failed. Server returned 400 or other error.");
      return null;
    }
  };

  const handleAddMedia = async (file, type) => {
    if (!file) return;

    // Use a unique ID for reliable tracking during the async operation
    const tempId = `new-${nextNewSectionId}`;
    setNextNewSectionId(prev => prev + 1);

    const localUrl = URL.createObjectURL(file);
    const tempSection = { type, content: localUrl, tempId: tempId };
    
    // 1. Add temporary section
    setSections((prev) => [...prev, tempSection]);

    // 2. Start upload
    const uploadedUrl = await uploadFileToBackend(file);

    // 3. Replace temporary section with final URL using the unique ID
    if (uploadedUrl) {
      setSections((prev) =>
        prev.map((s) => (s.tempId === tempId ? { type, content: uploadedUrl, tempId: tempId } : s))
      );
    } else {
      // If upload failed, remove the temporary section
       setSections((prev) => prev.filter(s => s.tempId !== tempId));
    }
  };

  // Simplified handlers to use the combined function
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

  const handleRemoveContent = (index) => setSections((prev) => prev.filter((_, i) => i !== index));

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
    const uploadedUrl = await uploadFileToBackend(file);
    if (!uploadedUrl) return;
    setFormData((prev) => ({ ...prev, previewImageUrl: uploadedUrl }));
    setPreviewURL(uploadedUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // strip the temporary keys before sending to the backend
    const cleanSections = sections.map(({ type, content }) => ({ type, content }));

    const data = {
      ...formData,
      sections: cleanSections,
    };

    try {
      await projectApi.updateProject(id, data);
      toast.success("Project updated successfully! 🎉", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate("/admin/dashboard/projects"),
      });
    } catch (err) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || "Failed to update project. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex-1 p-6 bg-[#F5F1EE]">
      <nav className="text-sm font-medium mb-4 text-[#722F37]">
        <span>Projects</span> &gt; <span>Edit Project</span>
      </nav>

      <form onSubmit={handleSubmit} className="bg-white border rounded p-6 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6 items-start">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-lg text-[#722F37]">1. Mandatory Fields</h2>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Project Name *" className="border p-2 rounded w-full border-[#C9BEB8]" required />
            <select name="location" value={formData.location} onChange={handleChange} className="border p-2 rounded w-full border-[#C9BEB8]" required>
              <option value="">Select State/UT *</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <select name="category" value={selectedCategory} onChange={handleCategoryChange} className="border p-2 rounded w-full border-[#C9BEB8]" required>
                <option value="">Select Category *</option>
                {TAG_OPTIONS.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select name="subCategory" value={formData.subCategory} onChange={handleChange} className="border p-2 rounded w-full border-[#C9BEB8]" disabled={!availableSubCategories.length}>
                <option value="">Select Sub-Category</option>
                {availableSubCategories.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
            <input type="text" name="client" value={formData.client} onChange={handleChange} placeholder="Client *" className="border p-2 rounded w-full border-[#C9BEB8]" required />
            <input type="text" name="projectTeam" value={formData.projectTeam} onChange={handleChange} placeholder="Project Team *" className="border p-2 rounded w-full border-[#C9BEB8]" required />
            <input type="text" name="collaborators" value={formData.collaborators} onChange={handleChange} placeholder="Collaborators *" className="border p-2 rounded w-full border-[#C9BEB8]" required />
            <div className="grid grid-cols-2 gap-2">
              <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded w-full border-[#C9BEB8]" required>
                <option value="">Select Status *</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
              <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Year *" className="border p-2 rounded w-full border-[#C9BEB8]" required />
            </div>
          </div>

          {/* Preview Upload */}
          <div className="flex flex-col gap-2 items-center justify-center border p-4 rounded border-[#C9BEB8]">
            <label htmlFor="preview-upload" className="flex items-center gap-2 px-4 py-2 bg-[#722F37] text-white rounded-md cursor-pointer hover:bg-[#632932] transition">
              <FiUpload />
              <span className="text-sm font-medium">Upload Preview</span>
              <input id="preview-upload" type="file" accept="image/*,.gif" onChange={handlePreviewChange} className="hidden" />
            </label>
            {previewURL && <img src={previewURL} alt="Preview" className="w-auto h-68 object-cover rounded mt-2" />}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-6 flex flex-col gap-4">
          <h2 className="font-bold text-lg text-[#722F37]">2. Tags</h2>
          {/* Note: value should be set to an empty string to allow selecting tags that are not the first one */}
          <select name="tags" onChange={handleChange} className="border p-2 rounded w-full border-[#C9BEB8]" value={""}>
            <option value="" disabled>Select Tag...</option>
            {TAG_OPTIONS.map((tag) => <option key={tag} value={tag} disabled={formData.tags.includes(tag)}>{tag}</option>)}
          </select>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 bg-[#D9D2CC] text-[#474545] text-xs px-3 py-1 rounded-full">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="text-gray-600 hover:text-gray-800">&times;</button>
              </span>
            ))}
          </div>
        </div>

        {/* Key Date */}
        <div>
          <label htmlFor="keyDate" className="block text-sm font-medium text-[#722F37] mb-1">Key Date</label>
          <input id="keyDate" type="date" name="keyDate" value={formData.keyDate} onChange={handleChange} className="border p-2 rounded w-full border-[#C9BEB8]" />
        </div>

        {/* Sections */}
        <div className="mt-6">
          <h2 className="font-bold text-lg mb-4 text-[#722F37]">3. Content Sections</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {/* Using section.tempId as the key for both mapping and Draggable is best practice */}
                  {sections.map((section, index) => (
                    <Draggable key={section.tempId} draggableId={section.tempId} index={index}>
                      {(provided) => (
                        <div
                          className="mb-4 border rounded p-4 border-[#C9BEB8] bg-white flex flex-col gap-2"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-[#722F37]">
                              {section.type === "text" ? "Text Section" : `${section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section`}
                            </h3>
                            <div className="flex gap-2 items-center">
                              <button type="button" onClick={() => handleRemoveContent(index)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                              <span {...provided.dragHandleProps} className="cursor-move text-gray-400"><FaGripVertical /></span>
                            </div>
                          </div>
                          {section.type === "text" ? (
                            <>
                              <textarea className="border p-2 rounded w-full border-[#C9BEB8] min-h-[100px]" value={section.content} placeholder="Enter text" onChange={(e) => handleContentChange(index, e.target.value)} maxLength={MAX_TEXT_LENGTH} />
                              <div className="text-right text-xs text-gray-500">{section.content.length} / {MAX_TEXT_LENGTH}</div>
                            </>
                          ) : (
                            <div className="flex justify-center w-full">
                              {/* Using the content URL as the src */}
                              <img src={section.content} alt={`${section.type} content`} className="max-h-40 rounded object-cover" />
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

          <div className="flex gap-2 justify-center mt-4">
            <button type="button" onClick={handleAddText} className="px-4 py-2 text-sm rounded bg-[#722F37] text-white">+ Add Text</button>
            <label className="px-4 py-2 text-sm rounded bg-green-600 text-white cursor-pointer">
              + Add Image
              <input type="file" accept="image/*" className="hidden" onChange={handleAddImage} />
            </label>
            <label className="px-4 py-2 text-sm rounded bg-purple-600 text-white cursor-pointer">
              + Add GIF
              <input type="file" accept=".gif,image/gif" className="hidden" onChange={handleAddGif} />
            </label>
          </div>
        </div>

        <button type="submit" className="bg-[#722F37] text-white px-4 py-2 rounded w-32 self-end mt-6">Update Project</button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditProject;