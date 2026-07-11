import { api } from "@/lib/apiClient";

export const bookmarkApi = {
  list: () => api.get("/bookmarks"), // { bookmarks }
  create: (payload) => api.post("/bookmarks", payload), // { bookmark }
  update: (id, payload) => api.patch(`/bookmarks/${id}`, payload),
  remove: (id) => api.del(`/bookmarks/${id}`),
};
