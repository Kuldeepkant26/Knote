import { api } from "@/lib/apiClient";

export const taskApi = {
  list: () => api.get("/tasks"), // { tasks }
  create: (payload) => api.post("/tasks", payload), // { task }
  update: (id, payload) => api.patch(`/tasks/${id}`, payload),
  remove: (id) => api.del(`/tasks/${id}`),
};
