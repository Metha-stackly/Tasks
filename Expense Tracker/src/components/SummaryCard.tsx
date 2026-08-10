interface SummaryCardProps {
  totalExpenses: number;
  numberOfExpenses: number;
  highestExpense: number;
}

function SummaryCard({
  totalExpenses,
  numberOfExpenses,
  highestExpense,
}: SummaryCardProps) {
  return (
    <div>

      <h2>Summary</h2>

      <p>
        Total Expenses: ₹{totalExpenses}
      </p>

      <p>
        Number of Expenses: {numberOfExpenses}
      </p>

      <p>
        Highest Expense: ₹{highestExpense}
      </p>

    </div>
  );
}

export default SummaryCard;