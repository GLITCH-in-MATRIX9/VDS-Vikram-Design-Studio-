import axios from "axios";

// Normalize base (same logic as teamapi)
const rawBase = import.meta.env.VITE_API_URL;
const fallbackBase = import.meta.env.DEV ? "http://localhost:5000" : "/api";
const resolvedBase = (rawBase || fallbackBase).replace(/\/+$/g, "");
const apiBase = resolvedBase.endsWith("/api")
  ? `${resolvedBase}/content/contact`
  : `${resolvedBase}/api/content/contact`;

const api = axios.create({
  baseURL: apiBase,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const contactLocationApi = {
  getContactContent: async () => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.get("/", { headers });
    return data;
  },

  updateContactContent: async (content, lastModifiedBy) => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.put(
      "/",
      { content, lastModifiedBy },
      { headers }
    );
    return data;
  },
};

export default contactLocationApi;
