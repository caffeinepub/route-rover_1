import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export default function BudgetPreview() {
  const budgetData = {
    total: 5000,
    spent: 3200,
    categories: [
      { name: 'Accommodation', budget: 2000, spent: 1500, color: 'bg-blue-500' },
      { name: 'Food', budget: 1000, spent: 800, color: 'bg-green-500' },
      { name: 'Activities', budget: 1500, spent: 700, color: 'bg-purple-500' },
      { name: 'Transport', budget: 500, spent: 200, color: 'bg-orange-500' },
    ],
    prediction: 4100,
  };

  const remaining = budgetData.total - budgetData.spent;
  const percentageSpent = (budgetData.spent / budgetData.total) * 100;
  const isOverBudget = budgetData.prediction > budgetData.total;

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Budget Overview</CardTitle>
            <CardDescription>Track expenses and predictions</CardDescription>
          </div>
          <Badge variant={isOverBudget ? 'destructive' : 'secondary'}>
            {isOverBudget ? 'Over Budget' : 'On Track'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Total Budget Summary */}
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">Total Budget</div>
              <div className="text-4xl font-bold">${budgetData.total.toLocaleString()}</div>
            </div>
            <DollarSign className="h-12 w-12 opacity-50" />
          </div>
          
          <Progress value={percentageSpent} className="mb-2 h-3 bg-white/20" />
          
          <div className="flex items-center justify-between text-sm">
            <span>Spent: ${budgetData.spent.toLocaleString()}</span>
            <span>Remaining: ${remaining.toLocaleString()}</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="mb-6 space-y-4">
          <h3 className="font-semibold">Category Breakdown</h3>
          {budgetData.categories.map((category, index) => {
            const categoryPercentage = (category.spent / category.budget) * 100;
            const isOverCategory = category.spent > category.budget;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span className={isOverCategory ? 'text-destructive' : 'text-muted-foreground'}>
                    ${category.spent} / ${category.budget}
                  </span>
                </div>
                <Progress 
                  value={Math.min(categoryPercentage, 100)} 
                  className="h-2"
                />
              </div>
            );
          })}
        </div>

        {/* Predictions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-3 ${isOverBudget ? 'bg-red-100' : 'bg-green-100'}`}>
                  {isOverBudget ? (
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-green-600" />
                  )}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Predicted Total</div>
                  <div className="text-2xl font-bold">${budgetData.prediction.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-3">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Daily Average</div>
                  <div className="text-2xl font-bold">
                    ${Math.round(budgetData.spent / 7).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Alert */}
        {isOverBudget && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border-2 border-destructive bg-destructive/10 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div className="text-sm">
              <div className="font-semibold text-destructive">Budget Warning</div>
              <div className="text-muted-foreground">
                Your predicted spending exceeds your budget by ${budgetData.prediction - budgetData.total}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
