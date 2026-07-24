import { api } from "@/lib/apiClient";

// Semantic wrappers over the API client. Each returns the `data` object.
export const notebookApi = {
  list: () => api.get("/notebooks"), // { notebooks }
  get: (id) => api.get(`/notebooks/${id}`), // { notebook } incl. sections + light pages
  create: (payload) => api.post("/notebooks", payload), // { notebook }
  update: (id, payload) => api.patch(`/notebooks/${id}`, payload),

  addSection: (id, payload) => api.post(`/notebooks/${id}/sections`, payload),
  updateSection: (id, sectionId, payload) => api.patch(`/notebooks/${id}/sections/${sectionId}`, payload),
};
