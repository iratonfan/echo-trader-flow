import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, TrendingDown, Calculator, Clock, DollarSign, Percent } from "lucide-react";
import { toast } from "sonner";

interface TradingPanelProps {
  symbol: string;
}

export const TradingPanel = ({ symbol }: TradingPanelProps) => {
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');

  const currentPrice = 155.67; // Mock current price
  const estimatedCost = parseFloat(quantity) * (orderType === 'market' ? currentPrice : parseFloat(price) || currentPrice);

  const handleTrade = () => {
    if (!quantity) {
      toast.error("Please enter quantity");
      return;
    }

    if (orderType === 'limit' && !price) {
      toast.error("Please enter limit price");
      return;
    }

    if (orderType === 'stop' && !stopPrice) {
      toast.error("Please enter stop price");
      return;
    }

    // Simulate order placement
    toast.success(`${side.toUpperCase()} order placed for ${quantity} shares of ${symbol}`, {
      description: `Order type: ${orderType.toUpperCase()}${orderType === 'limit' ? ` @ $${price}` : orderType === 'stop' ? ` @ $${stopPrice}` : ''}`
    });

    // Reset form
    setQuantity('');
    setPrice('');
    setStopPrice('');
  };

  const quickAmounts = [10, 25, 50, 100];
  const accountBalance = 125000; // Mock account balance
  const maxShares = Math.floor(accountBalance / currentPrice);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Trading Panel</h3>
        <Badge variant="outline" className="text-xs">
          Live Orders
        </Badge>
      </div>

      {/* Symbol Info */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-card to-card/80 border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono font-bold text-foreground">{symbol}</span>
          <div className="text-right">
            <div className="font-mono text-lg font-bold text-foreground">
              ${currentPrice.toFixed(2)}
            </div>
            <div className="text-xs text-bull">+2.34 (+1.52%)</div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Bid: $155.65</span>
          <span>Ask: $155.69</span>
          <span>Spread: $0.04</span>
        </div>
      </div>

      {/* Order Entry */}
      <Tabs value={side} onValueChange={(value) => setSide(value as 'buy' | 'sell')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy" className="text-bull data-[state=active]:bg-bull/20">
            <ShoppingCart className="w-3 h-3 mr-1" />
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="text-bear data-[state=active]:bg-bear/20">
            <TrendingDown className="w-3 h-3 mr-1" />
            Sell
          </TabsTrigger>
        </TabsList>

        <TabsContent value={side} className="space-y-3 mt-4">
          {/* Order Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Order Type</label>
            <Select value={orderType} onValueChange={(value) => setOrderType(value as any)}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market Order</SelectItem>
                <SelectItem value="limit">Limit Order</SelectItem>
                <SelectItem value="stop">Stop Order</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-foreground">Quantity</label>
              <span className="text-xs text-muted-foreground">Max: {maxShares}</span>
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="Shares"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-background/50"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <span className="text-xs text-muted-foreground">shares</span>
              </div>
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="flex space-x-1">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(amount.toString())}
                  className="flex-1 text-xs"
                >
                  {amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Fields */}
          {orderType === 'limit' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Limit Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-10 bg-background/50"
                  step="0.01"
                />
              </div>
            </div>
          )}

          {orderType === 'stop' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Stop Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                  className="pl-10 bg-background/50"
                  step="0.01"
                />
              </div>
            </div>
          )}

          {/* Order Summary */}
          {quantity && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Cost:</span>
                  <span className="font-mono font-bold text-foreground">
                    ${estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commission:</span>
                  <span className="font-mono text-foreground">$0.00</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-mono font-bold text-foreground">
                    ${estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            onClick={handleTrade}
            className={`w-full ${
              side === 'buy' 
                ? 'bg-bull hover:bg-bull/90 text-bull-foreground' 
                : 'bg-bear hover:bg-bear/90 text-bear-foreground'
            }`}
            disabled={!quantity}
          >
            {side === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
          </Button>
        </TabsContent>
      </Tabs>

      {/* Account Info */}
      <div className="space-y-2 pt-3 border-t border-border">
        <h4 className="text-sm font-medium text-foreground">Account</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Buying Power:</span>
            <span className="font-mono text-foreground">${accountBalance.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Day Trades:</span>
            <span className="font-mono text-foreground">2/3</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Recent Orders</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {[
            { symbol: 'AAPL', side: 'buy', qty: 50, price: 155.32, status: 'filled' },
            { symbol: 'GOOGL', side: 'sell', qty: 10, price: 2580.00, status: 'pending' },
          ].map((order, index) => (
            <div key={index} className="p-2 rounded-lg bg-card border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={order.side === 'buy' ? 'default' : 'destructive'} 
                    className="text-xs"
                  >
                    {order.side.toUpperCase()}
                  </Badge>
                  <span className="font-mono text-xs text-foreground">{order.symbol}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs text-foreground">
                    {order.qty} @ ${order.price}
                  </div>
                  <div className={`text-xs ${
                    order.status === 'filled' ? 'text-bull' : 'text-yellow-500'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};