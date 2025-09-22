import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, BarChart3, Zap } from "lucide-react";

interface PriceChartProps {
  symbol: string;
}

interface ChartData {
  time: string;
  price: number;
  volume: number;
  sma20: number;
  rsi: number;
}

export const PriceChart = ({ symbol }: PriceChartProps) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeframe, setTimeframe] = useState("1D");
  const [indicators, setIndicators] = useState({ sma: true, rsi: false });

  useEffect(() => {
    // Generate realistic chart data with technical indicators
    const generateChartData = () => {
      const data: ChartData[] = [];
      let basePrice = 150 + Math.random() * 100;
      let trend = (Math.random() - 0.5) * 0.02;
      
      for (let i = 0; i < 100; i++) {
        const volatility = Math.random() * 0.05;
        const noise = (Math.random() - 0.5) * volatility;
        basePrice += basePrice * (trend + noise);
        
        // Calculate SMA20
        const sma20 = i >= 19 ? 
          data.slice(Math.max(0, i - 19), i + 1).reduce((sum, d) => sum + d.price, basePrice) / 20 :
          basePrice;

        // Calculate RSI (simplified)
        const rsi = 30 + Math.random() * 40;
        
        data.push({
          time: new Date(Date.now() - (99 - i) * 60000).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          price: basePrice,
          volume: Math.floor(Math.random() * 1000000),
          sma20,
          rsi,
        });
      }
      return data;
    };

    setChartData(generateChartData());
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev];
        const lastPrice = newData[newData.length - 1].price;
        const change = lastPrice * (Math.random() - 0.5) * 0.02;
        
        newData.push({
          time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          price: lastPrice + change,
          volume: Math.floor(Math.random() * 1000000),
          sma20: lastPrice + change,
          rsi: 30 + Math.random() * 40,
        });
        
        return newData.slice(-100);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [symbol]);

  const currentPrice = chartData[chartData.length - 1]?.price || 0;
  const previousPrice = chartData[chartData.length - 2]?.price || 0;
  const change = currentPrice - previousPrice;
  const changePercent = (change / previousPrice) * 100;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-mono text-sm text-muted-foreground">{label}</p>
          <p className="font-mono font-bold text-foreground">
            Price: ${payload[0].value?.toFixed(2)}
          </p>
          {indicators.sma && payload[1] && (
            <p className="font-mono text-sm text-primary">
              SMA20: ${payload[1].value?.toFixed(2)}
            </p>
          )}
          <p className="font-mono text-xs text-muted-foreground">
            Volume: {payload[0].payload.volume?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{symbol}</h3>
          <div className="flex items-center space-x-3">
            <span className="font-mono text-2xl font-bold text-foreground">
              ${currentPrice.toFixed(2)}
            </span>
            <div className={`flex items-center space-x-1 ${
              change >= 0 ? 'text-bull' : 'text-bear'
            }`}>
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-mono text-sm">
                {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="animate-pulse-glow">
            <Zap className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          {["1D", "1W", "1M", "3M", "1Y"].map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className="px-3 py-1 text-xs"
            >
              {tf}
            </Button>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={indicators.sma ? "default" : "outline"}
            size="sm"
            onClick={() => setIndicators(prev => ({ ...prev, sma: !prev.sma }))}
            className="text-xs"
          >
            SMA20
          </Button>
          <Button
            variant={indicators.rsi ? "default" : "outline"}
            size="sm"
            onClick={() => setIndicators(prev => ({ ...prev, rsi: !prev.rsi }))}
            className="text-xs"
          >
            RSI
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full bg-gradient-to-br from-card to-card/50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
            />
            
            {indicators.sma && (
              <Line
                type="monotone"
                dataKey="sma20"
                stroke="hsl(var(--chart-2))"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
            
            <ReferenceLine 
              y={chartData[0]?.price || 0} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="2 2" 
              opacity={0.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Technical Analysis Summary */}
      <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Signal</div>
          <div className={`font-mono font-bold ${
            changePercent > 2 ? 'text-bull' : changePercent < -2 ? 'text-bear' : 'text-neutral'
          }`}>
            {changePercent > 2 ? 'BUY' : changePercent < -2 ? 'SELL' : 'HOLD'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Volatility</div>
          <div className="font-mono font-bold text-foreground">
            {Math.abs(changePercent).toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Trend</div>
          <div className={`font-mono font-bold ${
            change >= 0 ? 'text-bull' : 'text-bear'
          }`}>
            {change >= 0 ? 'BULLISH' : 'BEARISH'}
          </div>
        </div>
      </div>
    </div>
  );
};