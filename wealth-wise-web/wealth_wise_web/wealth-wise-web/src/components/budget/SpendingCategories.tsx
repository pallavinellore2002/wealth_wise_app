
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Transaction } from "@/hooks/use-budget-data";

interface SpendingCategoriesProps {
  transactions: Transaction[];
}

const SpendingCategories = ({ transactions }: SpendingCategoriesProps) => {
  // Calculate total expenses
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Group expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce<Record<string, number>>((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = 0;
      }
      acc[curr.category] += curr.amount;
      return acc;
    }, {});

  // Convert to array and sort by amount
  const categories = Object.entries(expensesByCategory)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{category.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ₹{category.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {category.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress value={category.percentage} />
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No expense data to show
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingCategories;
