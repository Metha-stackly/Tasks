import { useState } from "react";
import type { Expense } from "../types/Expense";

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
}

interface ExpenseFormData {
  description: string;
  category: string;
  amount: string;
  date: string;
}

const initialFormData: ExpenseFormData = {
  description: "",
  category: "",
  amount: "",
  date: "",
};

function ExpenseForm({
  onAddExpense,
}: ExpenseFormProps) {
  const [formData, setFormData] =
    useState<ExpenseFormData>(initialFormData);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const newExpense: Expense = {
      id: Date.now(),
      description: formData.description,
      category: formData.category,
      amount: Number(formData.amount),
      date: formData.date,
    };

    onAddExpense(newExpense);

    setFormData(initialFormData);
  }

  return (
    <form onSubmit={handleSubmit}>

      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">
          Select Category
        </option>

        <option value="Food">
          Food
        </option>

        <option value="Travel">
          Travel
        </option>

        <option value="Shopping">
          Shopping
        </option>

        <option value="Bills">
          Bills
        </option>
      </select>

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        min="0"
        required
      />

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <button type="submit">
        Add Expense
      </button>

    </form>
  );
}

export default ExpenseForm;