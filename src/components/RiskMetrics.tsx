import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Shield, AlertTriangle, TrendingUp, BarChart3, Target, Zap } from "lucide-react";

interface RiskMetric {
  label: string;
  value: number;
  max: number;
  level: 'low' | 'medium' | 'high';
  description: string;
}

export const RiskMetrics = () => {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([]);
  const [overallRisk, setOverallRisk] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    const updateMetrics = () => {
      const metrics: RiskMetric[] = [
        {
          label: "VaR (1-day)",
          value: 2.5 + Math.random() * 2,
          max: 10,
          level: 'medium',
          description: "Potential loss in 1 day (95% confidence)"
        },
        {
          label: "Beta",
          value: 0.8 + Math.random() * 0.6,
          max: 2,
          level: 'low',
          description: "Sensitivity to market movements"
        },
        {
          label: "Volatility",
          value: 15 + Math.random() * 20,
          max: 50,
          level: 'medium',
          description: "Price fluctuation measure (30-day)"
        },
        {
          label: "Sharpe Ratio",
          value: 0.5 + Math.random() * 1.5,
          max: 3,
          level: 'medium',
          description: "Risk-adjusted return"
        },
        {
          label: "Max Drawdown",
          value: 5 + Math.random() * 15,
          max: 30,
          level: 'medium',
          description: "Largest peak-to-trough loss"
        },
        {
          label: "Correlation",
          value: 0.3 + Math.random() * 0.5,
          max: 1,
          level: 'low',
          description: "Portfolio diversification measure"
        }
      ];

      // Determine risk levels based on values
      metrics.forEach(metric => {
        const percentage = (metric.value / metric.max) * 100;
        if (percentage < 30) metric.level = 'low';
        else if (percentage < 70) metric.level = 'medium';
        else metric.level = 'high';
      });

      setRiskMetrics(metrics);

      // Calculate overall risk
      const avgRiskLevel = metrics.reduce((sum, m) => {
        const levelScore = m.level === 'low' ? 1 : m.level === 'medium' ? 2 : 3;
        return sum + levelScore;
      }, 0) / metrics.length;

      setOverallRisk(avgRiskLevel < 1.5 ? 'low' : avgRiskLevel < 2.5 ? 'medium' : 'high');
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'text-bull';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-bear';
    }
  };

  const getRiskBadgeVariant = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Risk Analysis</h3>
        <Badge variant={getRiskBadgeVariant(overallRisk)} className="text-xs">
          {overallRisk.toUpperCase()} RISK
        </Badge>
      </div>

      {/* Overall Risk Score */}
      <Card className="p-4 bg-gradient-to-r from-card to-card/80 border-border/50">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            overallRisk === 'low' ? 'bg-bull/20' : 
            overallRisk === 'medium' ? 'bg-yellow-500/20' : 'bg-bear/20'
          }`}>
            {overallRisk === 'low' ? (
              <Shield className="w-5 h-5 text-bull" />
            ) : overallRisk === 'medium' ? (
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            ) : (
              <Zap className="w-5 h-5 text-bear" />
            )}
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Portfolio Risk Level</div>
            <div className={`text-lg font-bold ${getRiskColor(overallRisk)}`}>
              {overallRisk === 'low' ? 'Conservative' : 
               overallRisk === 'medium' ? 'Moderate' : 'Aggressive'}
            </div>
          </div>
        </div>
      </Card>

      {/* Risk Metrics */}
      <div className="space-y-3">
        {riskMetrics.map((metric, index) => (
          <div key={metric.label} className="p-3 rounded-lg bg-card border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground">
                  {metric.label}
                </span>
                <Badge variant="outline" className="text-xs">
                  {metric.level}
                </Badge>
              </div>
              <span className={`font-mono font-bold text-sm ${getRiskColor(metric.level)}`}>
                {metric.label === 'Sharpe Ratio' || metric.label === 'Beta' || metric.label === 'Correlation' 
                  ? metric.value.toFixed(2)
                  : metric.label === 'VaR (1-day)' || metric.label === 'Volatility' || metric.label === 'Max Drawdown'
                  ? `${metric.value.toFixed(1)}%`
                  : metric.value.toFixed(2)
                }
              </span>
            </div>
            
            <div className="space-y-1">
              <Progress 
                value={(metric.value / metric.max) * 100} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                {metric.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Recommendations */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Risk Recommendations</h4>
        <div className="space-y-2">
          {overallRisk === 'high' && (
            <div className="p-3 rounded-lg bg-bear/10 border border-bear/20">
              <div className="flex items-center space-x-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-bear" />
                <span className="text-sm font-medium text-bear">High Risk Alert</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Consider reducing position sizes or diversifying holdings
              </p>
            </div>
          )}
          
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Optimization Tip</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {overallRisk === 'low' 
                ? "Consider adding growth assets for higher returns"
                : overallRisk === 'medium'
                ? "Well-balanced risk profile. Monitor VaR levels"
                : "Reduce concentration risk through diversification"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Risk Metrics Summary */}
      <div className="pt-3 border-t border-border">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Portfolio Volatility</span>
            <span className={`font-mono ${getRiskColor(overallRisk)}`}>
              {riskMetrics.find(m => m.label === 'Volatility')?.value.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Risk-Adjusted Return</span>
            <span className="text-foreground font-mono">
              {riskMetrics.find(m => m.label === 'Sharpe Ratio')?.value.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};