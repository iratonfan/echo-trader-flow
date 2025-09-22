import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Percent, Target } from "lucide-react";

interface PortfolioHolding {
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  allocation: number;
}

export const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalPnL, setTotalPnL] = useState(0);

  useEffect(() => {
    // Initialize portfolio with mock data
    const initialPortfolio: PortfolioHolding[] = [
      { symbol: "AAPL", shares: 50, avgPrice: 150, currentPrice: 155, allocation: 35 },
      { symbol: "GOOGL", shares: 20, avgPrice: 2500, currentPrice: 2580, allocation: 25 },
      { symbol: "MSFT", shares: 30, avgPrice: 300, currentPrice: 310, allocation: 20 },
      { symbol: "AMZN", shares: 15, avgPrice: 3200, currentPrice: 3150, allocation: 15 },
      { symbol: "TSLA", shares: 10, avgPrice: 800, currentPrice: 820, allocation: 5 },
    ];
    
    setPortfolio(initialPortfolio);

    // Simulate real-time price updates
    const interval = setInterval(() => {
      setPortfolio(prev => prev.map(holding => ({
        ...holding,
        currentPrice: holding.currentPrice * (1 + (Math.random() - 0.5) * 0.02)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const total = portfolio.reduce((sum, holding) => 
      sum + (holding.shares * holding.currentPrice), 0
    );
    const pnl = portfolio.reduce((sum, holding) => 
      sum + (holding.shares * (holding.currentPrice - holding.avgPrice)), 0
    );
    
    setTotalValue(total);
    setTotalPnL(pnl);
  }, [portfolio]);

  const chartData = portfolio.map(holding => ({
    name: holding.symbol,
    value: holding.shares * holding.currentPrice,
    color: `hsl(var(--chart-${(portfolio.indexOf(holding) % 5) + 1}))`
  }));

  const totalReturn = (totalPnL / (totalValue - totalPnL)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Portfolio</h3>
        <Badge variant={totalPnL >= 0 ? "default" : "destructive"} className="text-xs">
          {totalPnL >= 0 ? 'PROFIT' : 'LOSS'}
        </Badge>
      </div>

      {/* Portfolio Summary */}
      <div className="space-y-3">
        <div className="p-4 rounded-lg bg-gradient-to-r from-card to-card/80 border border-border/50">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Total Value</span>
          </div>
          <div className="font-mono text-2xl font-bold text-foreground">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-card border border-border/50">
            <div className="flex items-center space-x-2 mb-1">
              {totalPnL >= 0 ? (
                <TrendingUp className="w-3 h-3 text-bull" />
              ) : (
                <TrendingDown className="w-3 h-3 text-bear" />
              )}
              <span className="text-xs text-muted-foreground">P&L</span>
            </div>
            <div className={`font-mono font-bold text-sm ${
              totalPnL >= 0 ? 'text-bull' : 'text-bear'
            }`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-card border border-border/50">
            <div className="flex items-center space-x-2 mb-1">
              <Percent className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">Return</span>
            </div>
            <div className={`font-mono font-bold text-sm ${
              totalReturn >= 0 ? 'text-bull' : 'text-bear'
            }`}>
              {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Allocation Chart */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Allocation</h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [
                  `$${value.toLocaleString(undefined, { minimumFractionDigits: 0 })}`,
                  'Value'
                ]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Holdings List */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Holdings</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {portfolio.map((holding) => {
            const currentValue = holding.shares * holding.currentPrice;
            const pnl = holding.shares * (holding.currentPrice - holding.avgPrice);
            const pnlPercent = (pnl / (holding.shares * holding.avgPrice)) * 100;
            
            return (
              <div key={holding.symbol} className="p-3 rounded-lg bg-card border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-mono font-semibold text-sm text-foreground">
                      {holding.symbol}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      {holding.shares} shares @ ${holding.avgPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-foreground">
                      ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                    </div>
                    <div className={`text-xs font-mono ${
                      pnl >= 0 ? 'text-bull' : 'text-bear'
                    }`}>
                      {pnl >= 0 ? '+' : ''}${pnl.toFixed(0)} ({pnlPercent.toFixed(1)}%)
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Allocation</span>
                    <span className="text-foreground">{holding.allocation}%</span>
                  </div>
                  <Progress 
                    value={holding.allocation} 
                    className="h-1"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="pt-3 border-t border-border">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Day's Change</span>
            <span className="text-bull font-mono">+$2,847</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Diversification</span>
            <span className="text-foreground font-mono">Good</span>
          </div>
        </div>
      </div>
    </div>
  );
};