import axios from "axios";

/* ---------------- AXIOS INSTANCE ---------------- */

const api = axios.create({
  baseURL: `${
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  }/about`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------------- API METHODS ---------------- */

const aboutApi = {
  /* ---------- GET ABOUT PAGE ---------- */
  getAboutPage: async () => {
    const { data } = await api.get("/");
    return data;
  },

  /* ---------- UPDATE HERO ---------- */
  updateHero: async (content, lastModifiedBy) => {
    const { data } = await api.put("/hero", {
      content,
      lastModifiedBy,
    });
    return data;
  },

  /* ---------- UPDATE METRICS ---------- */
  updateMetrics: async (content, lastModifiedBy) => {
    const { data } = await api.put("/metrics", {
      content,
      lastModifiedBy,
    });
    return data;
  },

  /* ---------- UPDATE SECTIONS ---------- */
  updateSections: async (content, lastModifiedBy) => {
    const { data } = await api.put("/sections", {
      content,
      lastModifiedBy,
    });
    return data;
  },
};

export default aboutApi;
