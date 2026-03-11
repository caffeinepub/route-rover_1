import { useState } from 'react';
import { useGetTripExpenses, useAddExpense, useSetTripBudget } from '../hooks/useQueries';
import { BudgetCategory } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Plus, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface TripBudgetProps {
  tripId: string;
}

const BUDGET_CATEGORIES = [
  { value: BudgetCategory.accommodation, label: 'Accommodation', color: 'bg-blue-500' },
  { value: BudgetCategory.food, label: 'Food', color: 'bg-green-500' },
  { value: BudgetCategory.activities, label: 'Activities', color: 'bg-purple-500' },
  { value: BudgetCategory.transport, label: 'Transport', color: 'bg-orange-500' },
  { value: BudgetCategory.misc, label: 'Miscellaneous', color: 'bg-pink-500' },
];

export default function TripBudget({ tripId }: TripBudgetProps) {
  const { data: expenses = [], isLoading } = useGetTripExpenses(tripId);
  const { mutate: addExpense, isPending: isAddingExpense } = useAddExpense();
  const { mutate: setBudget, isPending: isSettingBudget } = useSetTripBudget();

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState<BudgetCategory>(BudgetCategory.food);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [budgetCategory, setBudgetCategory] = useState<BudgetCategory>(BudgetCategory.food);
  const [budgetAmount, setBudgetAmount] = useState('');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense(
      {
        tripId,
        category: expenseCategory,
        amount: parseFloat(expenseAmount),
        description: expenseDescription,
      },
      {
        onSuccess: () => {
          setIsAddExpenseOpen(false);
          setExpenseAmount('');
          setExpenseDescription('');
        },
      }
    );
  };

  const handleSetBudget = (e: React.FormEvent) => {
    e.preventDefault();
    setBudget(
      {
        tripId,
        category: budgetCategory,
        amount: parseFloat(budgetAmount),
      },
      {
        onSuccess: () => {
          setIsBudgetDialogOpen(false);
          setBudgetAmount('');
        },
      }
    );
  };

  const getCategoryTotal = (category: BudgetCategory) => {
    return expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading budget data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Track your trip expenses</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(getTotalExpenses())}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>By Category</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsBudgetDialogOpen(true)}>
              Set Budget
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {BUDGET_CATEGORIES.map(cat => {
            const total = getCategoryTotal(cat.value);
            return (
              <div key={cat.value} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${cat.color}`} />
                    <span className="font-medium">{cat.label}</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(total)}</span>
                </div>
                {total > 0 && (
                  <Progress value={100} className="h-2" />
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Expense</DialogTitle>
                  <DialogDescription>Record a new expense for this trip</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={expenseCategory}
                      onValueChange={(value) => setExpenseCategory(value as BudgetCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGET_CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (USD) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={expenseDescription}
                      onChange={(e) => setExpenseDescription(e.target.value)}
                      placeholder="What was this expense for?"
                      required
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isAddingExpense}>
                      {isAddingExpense ? 'Adding...' : 'Add Expense'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No expenses recorded yet
            </p>
          ) : (
            <div className="space-y-3">
              {expenses.slice(0, 10).map(expense => (
                <div key={expense.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-start gap-3">
                    <DollarSign className="mt-1 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {BUDGET_CATEGORIES.find(c => c.value === expense.category)?.label}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Set Budget Dialog */}
      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Category Budget</DialogTitle>
            <DialogDescription>Set a budget limit for a specific category</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSetBudget} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budgetCategory">Category *</Label>
              <Select
                value={budgetCategory}
                onValueChange={(value) => setBudgetCategory(value as BudgetCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetAmount">Budget Amount (USD) *</Label>
              <Input
                id="budgetAmount"
                type="number"
                step="0.01"
                min="0"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsBudgetDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSettingBudget}>
                {isSettingBudget ? 'Setting...' : 'Set Budget'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
