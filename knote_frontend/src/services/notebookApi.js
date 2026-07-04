import { api } from "@/lib/apiClient";

// Semantic wrappers over the API client. Each returns the `data` object.
export const notebookApi = {
  list: () => api.get("/notebooks"), // { notebooks }
  get: (id) => api.get(`/notebooks/${id}`), // { notebook } incl. sections + light pages
  create: (payload) => api.post("/notebooks", payload), // { notebook }
  update: (id, payload) => api.patch(`/notebooks/${id}`, payload),
  remove: (id) => api.del(`/notebooks/${id}`),

  addSection: (id, payload) => api.post(`/notebooks/${id}/sections`, payload),
  updateSection: (id, sectionId, payload) => api.patch(`/notebooks/${id}/sections/${sectionId}`, payload),
  removeSection: (id, sectionId) => api.del(`/notebooks/${id}/sections/${sectionId}`),
};
