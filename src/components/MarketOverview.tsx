import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

interface MarketOverviewProps {
  marketData: MarketData[] | null;
}

export const MarketOverview = ({ marketData }: MarketOverviewProps) => {
  if (!marketData) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-48 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-8 bg-muted rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const marketSummary = {
    totalMarketCap: marketData.reduce((sum, stock) => sum + stock.marketCap, 0),
    totalVolume: marketData.reduce((sum, stock) => sum + stock.volume, 0),
    gainers: marketData.filter(stock => stock.change > 0).length,
    losers: marketData.filter(stock => stock.change < 0).length,
    avgChange: marketData.reduce((sum, stock) => sum + stock.changePercent, 0) / marketData.length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Market Overview</h2>
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Market Cap</span>
          </div>
          <div className="text-2xl font-mono font-bold text-foreground">
            ${(marketSummary.totalMarketCap / 1e12).toFixed(2)}T
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Volume</span>
          </div>
          <div className="text-2xl font-mono font-bold text-foreground">
            {(marketSummary.totalVolume / 1e6).toFixed(0)}M
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-bull" />
            <span className="text-sm text-muted-foreground">Gainers</span>
          </div>
          <div className="text-2xl font-mono font-bold text-bull">
            {marketSummary.gainers}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-bear" />
            <span className="text-sm text-muted-foreground">Losers</span>
          </div>
          <div className="text-2xl font-mono font-bold text-bear">
            {marketSummary.losers}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Avg Change</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-2xl font-mono font-bold ${
              marketSummary.avgChange >= 0 ? 'text-bull' : 'text-bear'
            }`}>
              {marketSummary.avgChange >= 0 ? '+' : ''}{marketSummary.avgChange.toFixed(2)}%
            </span>
            <Badge variant={marketSummary.avgChange >= 0 ? "default" : "destructive"} className="text-xs">
              {marketSummary.avgChange >= 0 ? 'BULLISH' : 'BEARISH'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Top Movers */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Top Gainers</h3>
          <div className="space-y-2">
            {marketData
              .filter(stock => stock.change > 0)
              .sort((a, b) => b.changePercent - a.changePercent)
              .slice(0, 3)
              .map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-2 rounded-lg bg-bull/10 border border-bull/20">
                  <span className="font-mono font-medium text-foreground">{stock.symbol}</span>
                  <div className="text-right">
                    <div className="font-mono text-sm text-bull">
                      +{stock.changePercent.toFixed(2)}%
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      ${stock.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Top Losers</h3>
          <div className="space-y-2">
            {marketData
              .filter(stock => stock.change < 0)
              .sort((a, b) => a.changePercent - b.changePercent)
              .slice(0, 3)
              .map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-2 rounded-lg bg-bear/10 border border-bear/20">
                  <span className="font-mono font-medium text-foreground">{stock.symbol}</span>
                  <div className="text-right">
                    <div className="font-mono text-sm text-bear">
                      {stock.changePercent.toFixed(2)}%
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      ${stock.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};