
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";
import { Transaction } from "@/hooks/use-budget-data";
import { formatDistanceToNow } from "date-fns";

interface ExpenseTrackerProps {
  transactions: Transaction[];
}

const COLORS = [
  "#3B82F6", // blue
  "#EF4444", // red
  "#10B981", // green
  "#F59E0B", // amber
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#6366F1", // indigo
  "#14B8A6", // teal
  "#F97316", // orange
  "#A855F7", // purple
];

const ExpenseTracker = ({ transactions }: ExpenseTrackerProps) => {
  const [viewMode, setViewMode] = useState<'all' | 'income' | 'expense'>('all');
  
  // Filter transactions based on view mode
  const filteredTransactions = transactions.filter(t => {
    if (viewMode === 'all') return true;
    return t.type === viewMode;
  });
  
  // Sort by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // Prepare chart data
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce<Record<string, number>>((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = 0;
      }
      acc[curr.category] += curr.amount;
      return acc;
    }, {});

  const chartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setViewMode('all')}
                className={`px-3 py-1 rounded-md ${viewMode === 'all' ? 'bg-primary text-white' : 'bg-muted'}`}
              >
                All
              </button>
              <button 
                onClick={() => setViewMode('income')}
                className={`px-3 py-1 rounded-md ${viewMode === 'income' ? 'bg-primary text-white' : 'bg-muted'}`}
              >
                Income
              </button>
              <button 
                onClick={() => setViewMode('expense')}
                className={`px-3 py-1 rounded-md ${viewMode === 'expense' ? 'bg-primary text-white' : 'bg-muted'}`}
              >
                Expenses
              </button>
            </div>
            <div className="max-h-[400px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="font-medium">
                          {transaction.date.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(transaction.date, { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}₹
                        {transaction.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {sortedTransactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No expense data to show
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseTracker;
