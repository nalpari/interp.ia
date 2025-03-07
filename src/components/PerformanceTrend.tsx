import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PerformanceTrendProps {
  trend: "up" | "down" | "stable";
}

export default function PerformanceTrend({ trend }: PerformanceTrendProps) {
  switch (trend) {
    case "up":
      return <TrendingUp className="text-green-500" />;
    case "down":
      return <TrendingDown className="text-red-500" />;
    case "stable":
      return <Minus className="text-yellow-500" />;
    default:
      return null;
  }
}
