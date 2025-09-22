import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Search, TrendingUp, TrendingDown, Eye, Plus } from "lucide-react";

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

interface WatchlistProps {
  marketData: MarketData[] | null;
  selectedSymbol: string;
  onSymbolSelect: (symbol: string) => void;
}

export const Watchlist = ({ marketData, selectedSymbol, onSymbolSelect }: WatchlistProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>(["AAPL", "GOOGL", "MSFT"]);

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const filteredData = marketData?.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const favoriteStocks = filteredData.filter(stock => favorites.includes(stock.symbol));
  const otherStocks = filteredData.filter(stock => !favorites.includes(stock.symbol));

  if (!marketData) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
        <div className="h-10 bg-muted rounded animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const StockItem = ({ stock }: { stock: MarketData }) => (
    <div 
      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
        selectedSymbol === stock.symbol 
          ? 'border-primary bg-primary/10 shadow-glow' 
          : 'border-border hover:border-primary/50 hover:bg-card/80'
      }`}
      onClick={() => onSymbolSelect(stock.symbol)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(stock.symbol);
            }}
            className="p-1 h-auto"
          >
            <Star 
              className={`w-3 h-3 ${
                favorites.includes(stock.symbol) 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-muted-foreground'
              }`} 
            />
          </Button>
          <div>
            <div className="font-mono font-semibold text-sm text-foreground">
              {stock.symbol}
            </div>
            <div className="text-xs text-muted-foreground">
              Vol: {(stock.volume / 1e6).toFixed(1)}M
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-mono font-bold text-sm text-foreground">
            ${stock.price.toFixed(2)}
          </div>
          <div className={`flex items-center space-x-1 text-xs ${
            stock.change >= 0 ? 'text-bull' : 'text-bear'
          }`}>
            {stock.change >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span className="font-mono">
              {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Price indicator bar */}
      <div className="mt-2 w-full h-1 bg-muted rounded overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${
            stock.change >= 0 ? 'bg-bull' : 'bg-bear'
          }`}
          style={{ 
            width: `${Math.min(Math.abs(stock.changePercent) * 10, 100)}%`,
            animation: 'data-update 0.5s ease-out'
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Watchlist</h3>
        <Badge variant="outline" className="text-xs">
          {filteredData.length} stocks
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search symbols..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background/50 border-border/50"
        />
      </div>

      {/* Favorites Section */}
      {favoriteStocks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-foreground">Favorites</span>
          </div>
          <div className="space-y-2">
            {favoriteStocks.map((stock) => (
              <StockItem key={stock.symbol} stock={stock} />
            ))}
          </div>
        </div>
      )}

      {/* All Stocks */}
      {otherStocks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">All Stocks</span>
            <Button variant="ghost" size="sm" className="text-xs">
              <Plus className="w-3 h-3 mr-1" />
              Add Symbol
            </Button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {otherStocks.map((stock) => (
              <StockItem key={stock.symbol} stock={stock} />
            ))}
          </div>
        </div>
      )}

      {/* Market Status */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Market Status</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-bull rounded-full animate-pulse"></div>
            <span className="text-bull font-medium">OPEN</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-muted-foreground">Next Update</span>
          <span className="text-foreground font-mono">2s</span>
        </div>
      </div>
    </div>
  );
};