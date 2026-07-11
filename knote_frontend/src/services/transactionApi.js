import { api } from "@/lib/apiClient";

// Semantic wrappers over the API client. Each returns the `data` object.
export const transactionApi = {
  list: () => api.get("/transactions"), // { transactions }
  create: (payload) => api.post("/transactions", payload), // { transaction }
  update: (id, payload) => api.patch(`/transactions/${id}`, payload),
  remove: (id) => api.del(`/transactions/${id}`),
};
