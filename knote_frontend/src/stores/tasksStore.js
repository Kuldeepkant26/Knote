import { create } from "zustand";
import { taskApi } from "@/services/taskApi";

export const useTasksStore = create((set, get) => ({
  tasks: [],
  listLoaded: false,
  listLoading: false,

  fetchTasks: async () => {
    set({ listLoading: true });
    try {
      const { tasks } = await taskApi.list();
      set({ tasks, listLoaded: true });
    } finally {
      set({ listLoading: false });
    }
  },

  createTask: async (payload) => {
    const { task } = await taskApi.create(payload);
    await get().fetchTasks();
    return task;
  },

  toggleTask: async (id, done) => {
    await taskApi.update(id, { done: !done });
    await get().fetchTasks();
  },

  deleteTask: async (id) => {
    await taskApi.remove(id);
    set((s) => ({ tasks: s.tasks.filter((t) => t._id !== id) }));
  },
}));
