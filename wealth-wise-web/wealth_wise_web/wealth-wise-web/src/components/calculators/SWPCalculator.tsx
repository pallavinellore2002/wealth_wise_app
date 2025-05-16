
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon, ArrowDownFromLine } from "lucide-react";
import SliderInput from "./SliderInput";
import ResultCard from "./ResultCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const SWPCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState(2000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(8000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [years, setYears] = useState(20);
  const [results, setResults] = useState({
    finalCorpus: 0,
    totalWithdrawals: 0,
    remainingPrincipal: 0,
    exhaustionYear: 0,
    chartData: [] as any[],
  });

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const percentFormatter = (value: number) => `${value}%`;

  useEffect(() => {
    // Calculate SWP results
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = years * 12;
    
    let corpus = initialInvestment;
    let totalWithdrawn = 0;
    let chartData = [];
    let exhaustionYear = 0;
    let exhausted = false;
    
    // Add initial point for chart
    chartData.push({
      month: 0,
      year: 0,
      corpus,
      totalWithdrawn: 0,
    });

    for (let month = 1; month <= totalMonths; month++) {
      // Monthly returns
      const monthlyInterest = corpus * monthlyRate;
      
      // Deduct monthly withdrawal
      corpus = corpus + monthlyInterest - monthlyWithdrawal;
      totalWithdrawn += monthlyWithdrawal;
      
      // Check if corpus is exhausted
      if (corpus <= 0 && !exhausted) {
        exhaustionYear = Math.floor(month / 12);
        corpus = 0;
        exhausted = true;
      }
      
      // Add data points at yearly intervals for the chart
      if (month % 12 === 0) {
        const year = month / 12;
        chartData.push({
          month,
          year,
          corpus: Math.max(0, corpus),
          totalWithdrawn,
        });
      }
    }
    
    // If corpus never exhausted, set exhaustionYear to 0
    if (!exhausted) {
      exhaustionYear = 0;
    }
    
    setResults({
      finalCorpus: Math.max(0, corpus),
      totalWithdrawals: totalWithdrawn,
      remainingPrincipal: Math.min(initialInvestment, Math.max(0, corpus)),
      exhaustionYear,
      chartData,
    });
  }, [initialInvestment, monthlyWithdrawal, expectedReturn, years]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Systematic Withdrawal Plan (SWP) Calculator</h1>
      <p className="text-muted-foreground mb-8">
        Calculate how long your investments will last with regular withdrawals.
        Plan your retirement income or other regular cash flow needs.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="calculator-card">
            <CardHeader>
              <CardTitle className="text-xl">SWP Parameters</CardTitle>
              <CardDescription>Adjust the values to see how your investments sustain regular withdrawals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SliderInput
                label="Initial Investment"
                value={initialInvestment}
                onChange={setInitialInvestment}
                min={100000}
                max={10000000}
                step={100000}
                prefix="₹"
                formatter={(value) => value.toLocaleString("en-IN")}
              />
              
              <SliderInput
                label="Monthly Withdrawal"
                value={monthlyWithdrawal}
                onChange={setMonthlyWithdrawal}
                min={1000}
                max={100000}
                step={1000}
                prefix="₹"
                formatter={(value) => value.toLocaleString("en-IN")}
              />
              
              <SliderInput
                label="Expected Annual Return"
                value={expectedReturn}
                onChange={setExpectedReturn}
                min={4}
                max={20}
                step={0.5}
                suffix="%"
                formatter={percentFormatter}
              />
              
              <SliderInput
                label="Time Period"
                value={years}
                onChange={setYears}
                min={1}
                max={40}
                step={1}
                suffix=" years"
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="calculator-card">
            <CardHeader>
              <CardTitle className="text-xl">SWP Results</CardTitle>
              <CardDescription>Analysis of your systematic withdrawals over {years} years</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <ResultCard
                  title="Total Withdrawals"
                  value={formatter.format(results.totalWithdrawals)}
                  subtitle={`₹${monthlyWithdrawal.toLocaleString()} × ${years * 12} months`}
                  icon={<ArrowDownFromLine size={20} />}
                  className="bg-primary/10"
                />
                
                <ResultCard
                  title="Final Corpus"
                  value={formatter.format(results.finalCorpus)}
                  subtitle={results.exhaustionYear ? `Exhausted in Year ${results.exhaustionYear}` : "After withdrawals"}
                  className="bg-primary/5"
                />
                
                <ResultCard
                  title="Sustainability"
                  value={results.exhaustionYear ? `${results.exhaustionYear} years` : "Sustainable"}
                  subtitle={results.exhaustionYear 
                    ? "Corpus will be exhausted" 
                    : "Withdrawals sustainable for full period"}
                  icon={<WalletIcon size={20} />}
                  className={results.exhaustionYear ? "bg-red-50" : "bg-green-50"}
                />
              </div>
              
              <div className="h-[300px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={results.chartData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 10,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="year" 
                      label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => {
                        if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
                        if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
                        return value;
                      }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatter.format(value), ""]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Line 
                      name="Remaining Corpus"
                      type="monotone" 
                      dataKey="corpus" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      name="Total Withdrawals"
                      type="monotone" 
                      dataKey="totalWithdrawn" 
                      stroke="#0EA5E9" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SWPCalculator;
