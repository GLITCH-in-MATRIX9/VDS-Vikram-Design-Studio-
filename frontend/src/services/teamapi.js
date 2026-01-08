import axios from "axios";

// Determine base URL: prefer explicit VITE_API_URL, otherwise
// - in dev use localhost:5000 (common backend dev port)
// - in production fallback to relative '/api'
const resolvedBase =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

const api = axios.create({
  // backend mounts team routes under /api/content
  baseURL: `${resolvedBase}/content/team`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const teamApi = {
  getTeamPage: async () => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.get("/", { headers });
    return data;
  },

  updateHeading: async (content, lastModifiedBy) => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.put(
      "/heading",
      { content, lastModifiedBy },
      { headers }
    );
    return data;
  },

  updateMembers: async (content, lastModifiedBy) => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.put(
      "/members",
      { content, lastModifiedBy },
      { headers }
    );
    return data;
  },

  updateMarquee: async (content, lastModifiedBy) => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.put(
      "/marquee",
      { content, lastModifiedBy },
      { headers }
    );
    return data;
  },
};

export default teamApi;
