// Centralized API client for Bharat Bhoomi backend

const API_BASE = "/api";

function getHeaders(includeAuth = true) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (includeAuth) {
    const token = localStorage.getItem("bharat_bhoomi_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
}

export const api = {
  // Authentication
  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },

  // Land Parcels & RoR
  async getParcels(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE}/parcels?${query.toString()}`, {
      headers: getHeaders(false),
    });
    return handleResponse(res);
  },

  async getParcel(id) {
    const res = await fetch(`${API_BASE}/parcels/${id}`, {
      headers: getHeaders(false),
    });
    return handleResponse(res);
  },

  async createParcel(parcelData) {
    const res = await fetch(`${API_BASE}/parcels`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(parcelData),
    });
    return handleResponse(res);
  },

  async updateParcel(id, parcelData) {
    const res = await fetch(`${API_BASE}/parcels/${id}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(parcelData),
    });
    return handleResponse(res);
  },

  async mutateParcel(id, mutationData) {
    const res = await fetch(`${API_BASE}/parcels/${id}/mutate`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(mutationData),
    });
    return handleResponse(res);
  },

  async verifyParcel(id) {
    const res = await fetch(`${API_BASE}/parcels/${id}/verify`, {
      method: "POST",
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },

  async disputeParcel(id, disputeData) {
    const res = await fetch(`${API_BASE}/parcels/${id}/dispute`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(disputeData),
    });
    return handleResponse(res);
  },

  // Grievance & Feedback
  async submitGrievance(grievanceData) {
    const res = await fetch(`${API_BASE}/grievances`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify(grievanceData),
    });
    return handleResponse(res);
  },

  async trackGrievance(refId) {
    const res = await fetch(`${API_BASE}/grievances/track/${encodeURIComponent(refId)}`, {
      headers: getHeaders(false),
    });
    return handleResponse(res);
  },

  async getGrievances(params = {}) {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/grievances?${query.toString()}`, {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },

  async updateGrievance(id, updateData) {
    const res = await fetch(`${API_BASE}/grievances/${id}`, {
      method: "PATCH",
      headers: getHeaders(true),
      body: JSON.stringify(updateData),
    });
    return handleResponse(res);
  },

  // Statistics & Reports
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: getHeaders(false),
    });
    return handleResponse(res);
  },

  async getStateStats(stateName) {
    const res = await fetch(`${API_BASE}/stats/state/${encodeURIComponent(stateName)}`, {
      headers: getHeaders(false),
    });
    return handleResponse(res);
  },

  // Audit Logs & Users
  async getAuditLogs(params = {}) {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/audit-logs?${query.toString()}`, {
      headers: getHeaders(false),
    });
    return handleResponse(res);
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/users`, {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
};

export default api;
