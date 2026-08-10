import { useState } from "react";

import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SummaryCard from "../components/SummaryCard";

import type { Expense } from "../types/Expense";

function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState<string>("All");

  function addExpense(expense: Expense) {
    setExpenses((currentExpenses) => [
      ...currentExpenses,
      expense,
    ]);
  }

  function deleteExpense(id: number) {
    setExpenses((currentExpenses) =>
      currentExpenses.filter(
        (expense) => expense.id !== id
      )
    );
  }

  const filteredExpenses =
    selectedCategory === "All"
      ? expenses
      : expenses.filter(
          (expense) =>
            expense.category === selectedCategory
        );

  const totalExpenses = filteredExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const numberOfExpenses =
    filteredExpenses.length;

  const highestExpense =
    filteredExpenses.length === 0
      ? 0
      : Math.max(
          ...filteredExpenses.map(
            (expense) => expense.amount
          )
        );

  function handleCategoryChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setSelectedCategory(event.target.value);
  }

  return (
    <div className="expenses-page">

      <h1>Expense Tracker</h1>

      <section>
        <h2>Add Expense</h2>

        <ExpenseForm
          onAddExpense={addExpense}
        />
      </section>

      <section>
        <h2>Expense Summary</h2>

        <SummaryCard
          totalExpenses={totalExpenses}
          numberOfExpenses={numberOfExpenses}
          highestExpense={highestExpense}
        />
      </section>

      <section>
        <h2>Expense List</h2>

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="All">
            All Categories
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

        <ExpenseList
          expenses={filteredExpenses}
          onDeleteExpense={deleteExpense}
        />
      </section>

    </div>
  );
}

export default Expenses;