import axios from "axios";

const API_BASE =
  `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}`;

const ROLES_BASE = `${API_BASE}/roles`;
const APPLICATIONS_BASE = `${API_BASE}/applications`;

const jobApi = {
  /* =========================
   ADMIN
========================= */

  getAllRolesAdmin: async () => {
    const response = await axios.get(`${ROLES_BASE}/admin/all`);
    return response.data;
  },

  /* =========================
     ROLES
  ========================= */

  getRoles: async () => {
    const response = await axios.get(ROLES_BASE);
    return response.data;
  },

  getRoleBySlug: async (slug) => {
    const response = await axios.get(`${ROLES_BASE}/${slug}`);
    return response.data;
  },

  toggleRoleStatus: async (roleId, isActive) => {
    const response = await axios.patch(
      `${ROLES_BASE}/${roleId}/status`,
      { isActive }
    );
    return response.data;
  },



  /* =========================
     APPLICATIONS
  ========================= */

  submitApplication: async (payload) => {
    const response = await axios.post(
      APPLICATIONS_BASE,
      payload
    );
    return response.data;
  },

  getApplications: async () => {
    const response = await axios.get(APPLICATIONS_BASE);
    return response.data;
  },

  getApplicationsByRole: async (roleSlug) => {
    const response = await axios.get(
      `${APPLICATIONS_BASE}/role/${roleSlug}`
    );
    return response.data;
  },

  updateApplicationStatus: async (id, status) => {
    const response = await axios.patch(
      `${APPLICATIONS_BASE}/${id}/status`,
      { status }
    );
    return response.data;
  },

  deleteApplication: async (id) => {
    const response = await axios.delete(
      `${APPLICATIONS_BASE}/${id}`
    );
    return response.data;
  }
};

export default jobApi;
