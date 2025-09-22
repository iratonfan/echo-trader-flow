import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { MarketOverview } from "@/components/MarketOverview";
import { PriceChart } from "@/components/PriceChart";
import { Portfolio } from "@/components/Portfolio";
import { Watchlist } from "@/components/Watchlist";
import { RiskMetrics } from "@/components/RiskMetrics";
import { StockScreener } from "@/components/StockScreener";
import { TradingPanel } from "@/components/TradingPanel";

const Dashboard = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [marketData, setMarketData] = useState<any>(null);

  // Simulate real-time market data updates
  useEffect(() => {
    const updateMarketData = () => {
      const symbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "NVDA", "META", "NFLX"];
      const data = symbols.map(symbol => ({
        symbol,
        price: 100 + Math.random() * 400,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 10,
        volume: Math.floor(Math.random() * 10000000),
        marketCap: Math.floor(Math.random() * 3000000000000),
      }));
      setMarketData(data);
    };

    updateMarketData();
    const interval = setInterval(updateMarketData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trading Dashboard</h1>
          <p className="text-muted-foreground">Real-time market data and portfolio analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-bull rounded-full animate-pulse-glow"></div>
          <span className="text-sm text-muted-foreground">Live Market Data</span>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Market Overview - Full Width */}
        <Card className="col-span-12 p-6 bg-gradient-to-r from-card to-card/80 border-border/50">
          <MarketOverview marketData={marketData} />
        </Card>

        {/* Watchlist */}
        <Card className="col-span-12 lg:col-span-3 p-6">
          <Watchlist 
            marketData={marketData} 
            selectedSymbol={selectedSymbol}
            onSymbolSelect={setSelectedSymbol}
          />
        </Card>

        {/* Price Chart */}
        <Card className="col-span-12 lg:col-span-6 p-6">
          <PriceChart symbol={selectedSymbol} />
        </Card>

        {/* Trading Panel */}
        <Card className="col-span-12 lg:col-span-3 p-6">
          <TradingPanel symbol={selectedSymbol} />
        </Card>

        {/* Portfolio */}
        <Card className="col-span-12 lg:col-span-4 p-6">
          <Portfolio />
        </Card>

        {/* Risk Metrics */}
        <Card className="col-span-12 lg:col-span-4 p-6">
          <RiskMetrics />
        </Card>

        {/* Stock Screener */}
        <Card className="col-span-12 lg:col-span-4 p-6">
          <StockScreener />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;