import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, TrendingUp, TrendingDown, Star, Zap } from "lucide-react";

interface ScreenerResult {
  symbol: string;
  price: number;
  marketCap: number;
  peRatio: number;
  pbRatio: number;
  divYield: number;
  rsi: number;
  momentum: number;
  signal: 'buy' | 'sell' | 'hold';
  confidence: number;
}

export const StockScreener = () => {
  const [screenResults, setScreenResults] = useState<ScreenerResult[]>([]);
  const [screenType, setScreenType] = useState<'growth' | 'value' | 'momentum' | 'dividend'>('momentum');
  const [isScanning, setIsScanning] = useState(false);

  const screenTypes = [
    { key: 'momentum', label: 'Momentum', icon: TrendingUp },
    { key: 'growth', label: 'Growth', icon: Zap },
    { key: 'value', label: 'Value', icon: Star },
    { key: 'dividend', label: 'Dividend', icon: TrendingDown },
  ];

  useEffect(() => {
    const runScreener = () => {
      setIsScanning(true);
      
      // Simulate screening delay
      setTimeout(() => {
        const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'CRM', 'ADBE'];
        
        const results: ScreenerResult[] = symbols.map(symbol => {
          const rsi = 30 + Math.random() * 40;
          const momentum = (Math.random() - 0.5) * 20;
          
          // Determine signal based on screen type
          let signal: 'buy' | 'sell' | 'hold' = 'hold';
          let confidence = 50 + Math.random() * 40;
          
          switch (screenType) {
            case 'momentum':
              signal = momentum > 5 ? 'buy' : momentum < -5 ? 'sell' : 'hold';
              confidence = Math.abs(momentum) * 5 + 50;
              break;
            case 'growth':
              signal = rsi < 40 && momentum > 2 ? 'buy' : rsi > 70 ? 'sell' : 'hold';
              break;
            case 'value':
              const pe = 10 + Math.random() * 30;
              signal = pe < 15 && rsi < 50 ? 'buy' : pe > 25 ? 'sell' : 'hold';
              break;
            case 'dividend':
              const divYield = Math.random() * 5;
              signal = divYield > 3 && rsi < 60 ? 'buy' : divYield < 1 ? 'sell' : 'hold';
              break;
          }
          
          return {
            symbol,
            price: 100 + Math.random() * 400,
            marketCap: Math.floor(Math.random() * 3000) * 1e9,
            peRatio: 10 + Math.random() * 30,
            pbRatio: 1 + Math.random() * 5,
            divYield: Math.random() * 5,
            rsi,
            momentum,
            signal,
            confidence: Math.min(95, Math.max(confidence, 20)),
          };
        });

        // Sort by confidence/signal strength
        results.sort((a, b) => {
          if (a.signal === 'buy' && b.signal !== 'buy') return -1;
          if (b.signal === 'buy' && a.signal !== 'buy') return 1;
          return b.confidence - a.confidence;
        });

        setScreenResults(results);
        setIsScanning(false);
      }, 2000);
    };

    runScreener();
  }, [screenType]);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy': return 'text-bull';
      case 'sell': return 'text-bear';
      default: return 'text-neutral';
    }
  };

  const getSignalBadge = (signal: string) => {
    switch (signal) {
      case 'buy': return 'default';
      case 'sell': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Stock Screener</h3>
        <Badge variant="outline" className="text-xs">
          {isScanning ? 'Scanning...' : `${screenResults.length} results`}
        </Badge>
      </div>

      {/* Screen Type Selector */}
      <div className="flex space-x-1 p-1 bg-muted rounded-lg">
        {screenTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Button
              key={type.key}
              variant={screenType === type.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setScreenType(type.key as any)}
              className="flex-1 text-xs"
            >
              <Icon className="w-3 h-3 mr-1" />
              {type.label}
            </Button>
          );
        })}
      </div>

      {/* Screening Status */}
      {isScanning && (
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-sm text-primary">Analyzing market conditions...</span>
        </div>
      )}

      {/* Screen Results */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">
            {screenType.charAt(0).toUpperCase() + screenType.slice(1)} Opportunities
          </h4>
          <Button variant="outline" size="sm" className="text-xs">
            <Filter className="w-3 h-3 mr-1" />
            Filter
          </Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {screenResults.map((stock) => (
            <div key={stock.symbol} className="p-3 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-semibold text-sm text-foreground">
                    {stock.symbol}
                  </span>
                  <Badge variant={getSignalBadge(stock.signal)} className="text-xs">
                    {stock.signal.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-foreground">
                    ${stock.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${(stock.marketCap / 1e9).toFixed(1)}B
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                <div>
                  <span className="text-muted-foreground">P/E:</span>
                  <span className="font-mono ml-1 text-foreground">{stock.peRatio.toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">RSI:</span>
                  <span className={`font-mono ml-1 ${
                    stock.rsi < 30 ? 'text-bull' : stock.rsi > 70 ? 'text-bear' : 'text-foreground'
                  }`}>
                    {stock.rsi.toFixed(0)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Div:</span>
                  <span className="font-mono ml-1 text-foreground">{stock.divYield.toFixed(1)}%</span>
                </div>
              </div>

              {/* Confidence Score */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className={`font-mono ${getSignalColor(stock.signal)}`}>
                    {stock.confidence.toFixed(0)}%
                  </span>
                </div>
                <Progress 
                  value={stock.confidence} 
                  className="h-1"
                />
              </div>

              {/* Quick Stats */}
              <div className="mt-2 flex items-center justify-between text-xs">
                <div className={`flex items-center space-x-1 ${getSignalColor(stock.signal)}`}>
                  {stock.signal === 'buy' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : stock.signal === 'sell' ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <span className="w-3 h-3 bg-neutral rounded-full"></span>
                  )}
                  <span className="font-medium">
                    {stock.signal === 'buy' ? 'Strong Buy Signal' : 
                     stock.signal === 'sell' ? 'Sell Signal' : 'Neutral'}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {stock.momentum >= 0 ? '+' : ''}{stock.momentum.toFixed(1)}% momentum
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Screening Summary */}
      <div className="pt-3 border-t border-border">
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="text-center">
            <div className="text-bull font-mono font-bold">
              {screenResults.filter(s => s.signal === 'buy').length}
            </div>
            <div className="text-muted-foreground">Buy Signals</div>
          </div>
          <div className="text-center">
            <div className="text-neutral font-mono font-bold">
              {screenResults.filter(s => s.signal === 'hold').length}
            </div>
            <div className="text-muted-foreground">Hold</div>
          </div>
          <div className="text-center">
            <div className="text-bear font-mono font-bold">
              {screenResults.filter(s => s.signal === 'sell').length}
            </div>
            <div className="text-muted-foreground">Sell Signals</div>
          </div>
        </div>
      </div>
    </div>
  );
};