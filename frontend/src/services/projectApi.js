import axios from "axios";

const API_BASE = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
}/projects`;
const TAG_BASE = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
}/tags`;

const projectApi = {
  createProject: async (formData, config = {}) => {
    const response = await axios.post(API_BASE, formData, {
      withCredentials: true,
      ...config,
    });
    return response;
  },

  getProjects: async () => {
    const response = await axios.get(API_BASE);
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  },

  updateProject: async (id, formData) => {
    const response = await axios.put(`${API_BASE}/${id}`, formData, {
      withCredentials: true,
    });
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await axios.delete(`${API_BASE}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  searchProjects: async (query) => {
    const params = new URLSearchParams(query).toString();
    const response = await axios.get(`${API_BASE}/search?${params}`);
    return response.data;
  },

  toggleProjectStatus: async (id) => {
    const response = await axios.patch(
      `${API_BASE}/${id}/status`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  uploadFile: async (file) => {
    const fd = new FormData();
    fd.append("file", file);

    const response = await axios.post(`${API_BASE}/upload`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    return response.data;
  },

  getTags: async () => {
    const response = await axios.get(TAG_BASE, { withCredentials: true });
    return response.data; // returns array of tags
  },

  addTag: async (tag) => {
    const response = await axios.post(
      TAG_BASE,
      { tag },
      { withCredentials: true }
    );
    return response.data;
  },
};

export default projectApi;
