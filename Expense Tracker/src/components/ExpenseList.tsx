import type { Expense } from "../types/Expense";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: number) => void;
}

function ExpenseList({
  expenses,
  onDeleteExpense,
}: ExpenseListProps) {
  if (expenses.length === 0) {
    return <h2>No Expenses Found</h2>;
  }

  return (
    <div>

      {expenses.map((expense) => (
        <div key={expense.id}>

          <h3>{expense.description}</h3>

          <p>
            Category: {expense.category}
          </p>

          <p>
            Amount: ₹{expense.amount}
          </p>

          <p>
            Date: {expense.date}
          </p>

          <button
            onClick={() =>
              onDeleteExpense(expense.id)
            }
          >
            Delete
          </button>

        </div>
      ))}

    </div>
  );
}

export default ExpenseList;