
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon } from "lucide-react";
import SliderInput from "./SliderInput";
import ResultCard from "./ResultCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MutualFundCalculator = () => {
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [years, setYears] = useState(10);
  const [taxRate, setTaxRate] = useState(10);
  const [results, setResults] = useState({
    futureValue: 0,
    absoluteReturns: 0,
    cagr: 0,
    taxAmount: 0,
    postTaxReturns: 0,
    chartData: [] as any[],
  });

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const percentFormatter = (value: number) => `${value}%`;

  useEffect(() => {
    // Calculate future value using compound interest formula
    const futureValue = investmentAmount * Math.pow(1 + expectedReturn / 100, years);
    const absoluteReturns = futureValue - investmentAmount;
    
    // Calculate CAGR: (FV/PV)^(1/n) - 1
    const cagr = (Math.pow(futureValue / investmentAmount, 1 / years) - 1) * 100;
    
    // Calculate tax on capital gains
    const taxAmount = absoluteReturns * (taxRate / 100);
    const postTaxReturns = absoluteReturns - taxAmount;
    
    // Generate chart data
    const chartData = [];
    for (let year = 0; year <= years; year++) {
      const yearValue = investmentAmount * Math.pow(1 + expectedReturn / 100, year);
      chartData.push({
        year,
        value: Math.round(yearValue),
      });
    }
    
    setResults({
      futureValue,
      absoluteReturns,
      cagr,
      taxAmount,
      postTaxReturns,
      chartData,
    });
  }, [investmentAmount, expectedReturn, years, taxRate]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Mutual Fund Lumpsum Calculator</h1>
      <p className="text-muted-foreground mb-8">
        Calculate the future value of your one-time mutual fund investment and understand the potential returns over time.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="calculator-card">
            <CardHeader>
              <CardTitle className="text-xl">Investment Details</CardTitle>
              <CardDescription>Adjust the values to see your investment growth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SliderInput
                label="Investment Amount"
                value={investmentAmount}
                onChange={setInvestmentAmount}
                min={1000}
                max={10000000}
                step={10000}
                prefix="₹"
                formatter={(value) => value.toLocaleString("en-IN")}
              />
              
              <SliderInput
                label="Expected Return Rate"
                value={expectedReturn}
                onChange={setExpectedReturn}
                min={4}
                max={30}
                step={0.5}
                suffix="%"
                formatter={percentFormatter}
              />
              
              <SliderInput
                label="Time Period"
                value={years}
                onChange={setYears}
                min={1}
                max={30}
                step={1}
                suffix=" years"
              />
              
              <SliderInput
                label="Tax Rate"
                value={taxRate}
                onChange={setTaxRate}
                min={0}
                max={30}
                step={1}
                suffix="%"
                formatter={percentFormatter}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="calculator-card">
            <CardHeader>
              <CardTitle className="text-xl">Investment Growth</CardTitle>
              <CardDescription>Projected value and returns of your investment over {years} years</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <ResultCard
                  title="Future Value"
                  value={formatter.format(results.futureValue)}
                  subtitle={`After ${years} years`}
                  icon={<WalletIcon size={20} />}
                  className="bg-primary/10"
                />
                
                <ResultCard
                  title="Total Returns"
                  value={formatter.format(results.absoluteReturns)}
                  subtitle={`${((results.absoluteReturns / investmentAmount) * 100).toFixed(1)}% absolute returns`}
                  className="bg-primary/5"
                />
                
                <ResultCard
                  title="CAGR"
                  value={`${results.cagr.toFixed(2)}%`}
                  subtitle="Compounded Annual Growth Rate"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <ResultCard
                  title="Tax Amount"
                  value={formatter.format(results.taxAmount)}
                  subtitle={`At ${taxRate}% tax rate`}
                  className="bg-red-50"
                />
                
                <ResultCard
                  title="Post-Tax Returns"
                  value={formatter.format(results.postTaxReturns)}
                  subtitle="Returns after tax"
                  className="bg-green-50"
                />
              </div>
              
              <div className="h-[300px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={results.chartData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="year" 
                      label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }}
                      tickFormatter={(value) => value === 0 ? 'Start' : value}
                    />
                    <YAxis 
                      tickFormatter={(value) => {
                        if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
                        if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
                        return value;
                      }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatter.format(value), "Amount"]}
                      labelFormatter={(value) => value === 0 ? 'Start' : `Year ${value}`}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
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

export default MutualFundCalculator;
