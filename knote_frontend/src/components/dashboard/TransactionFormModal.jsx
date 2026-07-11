import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

const CATEGORIES = ["Food", "Utilities", "Entertainment", "Education", "Income", "Transport", "Health", "Other"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function TransactionFormModal({ open, onClose, onSubmit, transaction }) {
  const isEdit = !!transaction;
  const [description, setDescription] = useState(transaction?.description || "");
  const [category, setCategory] = useState(transaction?.category || "Other");
  const [sign, setSign] = useState(transaction && transaction.amount < 0 ? "expense" : "income");
  const [amount, setAmount] = useState(transaction ? String(Math.abs(transaction.amount)) : "");
  const [date, setDate] = useState(transaction ? transaction.date.slice(0, 10) : todayISO());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    const numeric = Number(amount);
    if (!amount || Number.isNaN(numeric) || numeric === 0) {
      setError("Enter a valid, non-zero amount");
      return;
    }
    setBusy(true);
    try {
      await onSubmit({
        description: description.trim(),
        category,
        amount: sign === "expense" ? -Math.abs(numeric) : Math.abs(numeric),
        date,
      });
      onClose();
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit transaction" : "Add transaction"}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="txn-description"
          label="Description"
          placeholder="e.g. Grocery Store"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={error}
          autoFocus
        />

        <div>
          <span className="field-label">Type</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSign("income")}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                sign === "income"
                  ? "border-success-500 bg-success-50 text-success-700"
                  : "border-mauve-200 text-mauve-500"
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setSign("expense")}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                sign === "expense"
                  ? "border-danger-500 bg-danger-50 text-danger-600"
                  : "border-mauve-200 text-mauve-500"
              }`}
            >
              Expense
            </button>
          </div>
        </div>

        <TextField
          id="txn-amount"
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div>
          <label htmlFor="txn-category" className="field-label">
            Category
          </label>
          <select
            id="txn-category"
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <TextField
          id="txn-date"
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" loading={busy}>
            {isEdit ? "Save" : "Add"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
