import { create } from "zustand";
import { transactionApi } from "@/services/transactionApi";

export const useTransactionsStore = create((set, get) => ({
  transactions: [],
  listLoaded: false,
  listLoading: false,

  fetchTransactions: async () => {
    set({ listLoading: true });
    try {
      const { transactions } = await transactionApi.list();
      set({ transactions, listLoaded: true });
    } finally {
      set({ listLoading: false });
    }
  },

  createTransaction: async (payload) => {
    const { transaction } = await transactionApi.create(payload);
    await get().fetchTransactions();
    return transaction;
  },

  updateTransaction: async (id, payload) => {
    await transactionApi.update(id, payload);
    await get().fetchTransactions();
  },

  deleteTransaction: async (id) => {
    await transactionApi.remove(id);
    set((s) => ({ transactions: s.transactions.filter((t) => t._id !== id) }));
  },
}));
