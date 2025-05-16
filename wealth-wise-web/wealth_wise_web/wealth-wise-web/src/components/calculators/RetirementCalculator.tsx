
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import SliderInput from "./SliderInput";
import ResultCard from "./ResultCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [currentMonthlyExpenses, setCurrentMonthlyExpenses] = useState(50000);
  const [currentSavings, setCurrentSavings] = useState(1000000);
  const [monthlyInvestment, setMonthlyInvestment] = useState(20000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);
  
  const [results, setResults] = useState({
    corpusNeeded: 0,
    monthlyExpensesAtRetirement: 0,
    savingsAtRetirement: 0,
    yearsAfterRetirement: 0,
    shortfall: 0,
    chartData: [] as any[],
  });

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const percentFormatter = (value: number) => `${value}%`;

  useEffect(() => {
    const yearsToRetirement = retirementAge - currentAge;
    
    // Calculate monthly expenses at retirement considering inflation
    const monthlyExpensesAtRetirement = currentMonthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    
    // Calculate annual expenses at retirement
    const annualExpensesAtRetirement = monthlyExpensesAtRetirement * 12;
    
    // Assuming person will live until 85 years after retirement
    const yearsAfterRetirement = 85 - retirementAge;
    
    // Calculate corpus needed at retirement (using 4% withdrawal rule as approximation)
    // This is a simplified calculation. A more accurate model would use a complex withdrawal strategy
    const corpusNeeded = annualExpensesAtRetirement * 25; // Approximately 25x annual expenses
    
    // Calculate future value of current savings
    const futureSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
    
    // Calculate future value of monthly investments
    const monthlyRate = expectedReturn / 100 / 12;
    const months = yearsToRetirement * 12;
    const futureInvestments = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    
    // Total savings at retirement
    const savingsAtRetirement = futureSavings + futureInvestments;
    
    // Calculate shortfall or surplus
    const shortfall = corpusNeeded - savingsAtRetirement;

    // Generate chart data
    const chartData = [];
    let currentSavingsValue = currentSavings;
    let currentInvestmentsValue = 0;
    
    for (let year = 0; year <= yearsToRetirement; year++) {
      // For the current year
      chartData.push({
        age: currentAge + year,
        savings: Math.round(currentSavingsValue + currentInvestmentsValue),
      });
      
      // Calculate for next year
      currentSavingsValue *= (1 + expectedReturn / 100);
      currentInvestmentsValue = currentInvestmentsValue * (1 + expectedReturn / 100) + monthlyInvestment * 12;
    }
    
    setResults({
      corpusNeeded,
      monthlyExpensesAtRetirement,
      savingsAtRetirement,
      yearsAfterRetirement,
      shortfall,
      chartData,
    });
  }, [currentAge, retirementAge, currentMonthlyExpenses, currentSavings, monthlyInvestment, expectedReturn, inflationRate]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Retirement Calculator</h1>
      <p className="text-muted-foreground mb-8">
        Plan your retirement by estimating the corpus you'll need and tracking your progress towards your retirement goals.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="calculator-card">
            <CardHeader>
              <CardTitle className="text-xl">Retirement Planning</CardTitle>
              <CardDescription>Adjust the values to plan your retirement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SliderInput
                label="Current Age"
                value={currentAge}
                onChange={setCurrentAge}
                min={20}
                max={70}
                step={1}
                suffix=" years"
              />
              
              <SliderInput
                label="Retirement Age"
                value={retirementAge}
                onChange={setRetirementAge}
                min={Math.max(currentAge + 1, 40)}
                max={80}
                step={1}
                suffix=" years"
              />
              
              <SliderInput
                label="Current Monthly Expenses"
                value={currentMonthlyExpenses}
                onChange={setCurrentMonthlyExpenses}
                min={10000}
                max={500000}
                step={5000}
                prefix="₹"
                formatter={(value) => value.toLocaleString("en-IN")}
              />
              
              <SliderInput
                label="Current Savings"
                value={currentSavings}
                onChange={setCurrentSavings}
                min={0}
                max={10000000}
                step={100000}
                prefix="₹"
                formatter={(value) => value.toLocaleString("en-IN")}
              />
              
              <SliderInput
                label="Monthly Investment"
                value={monthlyInvestment}
                onChange={setMonthlyInvestment}
                min={1000}
                max={200000}
                step={1000}
                prefix="₹"
                formatter={(value) => value.toLocaleString("en-IN")}
              />
              
              <SliderInput
                label="Expected Return Rate"
                value={expectedReturn}
                onChange={setExpectedReturn}
                min={4}
                max={15}
                step={0.5}
                suffix="%"
                formatter={percentFormatter}
              />
              
              <SliderInput
                label="Inflation Rate"
                value={inflationRate}
                onChange={setInflationRate}
                min={2}
                max={10}
                step={0.5}
                suffix="%"
                formatter={percentFormatter}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="calculator-card">
            <CardHeader>
              <CardTitle className="text-xl">Retirement Projection</CardTitle>
              <CardDescription>Your retirement forecast based on current inputs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <ResultCard
                  title="Required Corpus"
                  value={formatter.format(results.corpusNeeded)}
                  subtitle={`For ${results.yearsAfterRetirement} years post-retirement`}
                  icon={<GraduationCap size={20} />}
                  className="bg-primary/10"
                />
                
                <ResultCard
                  title="Projected Savings"
                  value={formatter.format(results.savingsAtRetirement)}
                  subtitle={`At age ${retirementAge}`}
                  className={results.shortfall <= 0 ? "bg-primary/5" : undefined}
                />
                
                <ResultCard
                  title={results.shortfall <= 0 ? "Surplus" : "Shortfall"}
                  value={formatter.format(Math.abs(results.shortfall))}
                  subtitle={results.shortfall <= 0 ? "Extra amount" : "Additional savings needed"}
                  className={results.shortfall <= 0 ? "bg-green-50" : "bg-red-50"}
                />
              </div>
              
              <div className="mt-4 p-4 bg-muted/50 rounded-lg mb-8">
                <p className="text-sm">
                  <span className="font-medium">Monthly expenses at retirement:</span>{" "}
                  {formatter.format(results.monthlyExpensesAtRetirement)} (adjusted for inflation)
                </p>
              </div>
              
              <div className="h-[300px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={results.chartData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottomRight', offset: -10 }} />
                    <YAxis 
                      tickFormatter={(value) => {
                        if (value >= 10000000) return `${(value / 10000000).toFixed(0)}Cr`;
                        if (value >= 100000) return `${(value / 100000).toFixed(0)}L`;
                        return value;
                      }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatter.format(value), "Savings"]}
                      labelFormatter={(value) => `Age: ${value}`}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="#8B5CF6" 
                      fill="url(#colorSavings)" 
                    />
                    <defs>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RetirementCalculator;
