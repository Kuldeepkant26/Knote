import { api } from "@/lib/apiClient";

export const pageApi = {
  get: (id) => api.get(`/pages/${id}`), // { page } full content
  create: (payload) => api.post("/pages", payload), // { page }
  update: (id, payload) => api.patch(`/pages/${id}`, payload), // autosave
  remove: (id) => api.del(`/pages/${id}`),
};
