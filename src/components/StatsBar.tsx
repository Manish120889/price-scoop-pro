import { TrendingDown, Tag, ShoppingBag, BarChart3 } from "lucide-react";
import type { Product } from "@/lib/mockData";

export const StatsBar = ({ products }: { products: Product[] }) => {
  if (products.length === 0) return null;

  const avgDiscount =
    products.reduce(
      (acc, p) => acc + ((p.originalPrice - p.currentPrice) / p.originalPrice) * 100,
      0
    ) / products.length;

  const totalSavings = products.reduce(
    (acc, p) => acc + (p.originalPrice - p.currentPrice),
    0
  );

  const nearLowest = products.filter(
    (p) => p.currentPrice <= p.lowestPrice * 1.05
  ).length;

  const stats = [
    {
      icon: ShoppingBag,
      label: "Products Found",
      value: products.length.toString(),
    },
    {
      icon: Tag,
      label: "Avg. Discount",
      value: `${avgDiscount.toFixed(0)}%`,
    },
    {
      icon: TrendingDown,
      label: "Near All-Time Low",
      value: nearLowest.toString(),
    },
    {
      icon: BarChart3,
      label: "Total Potential Savings",
      value: `$${totalSavings.toFixed(0)}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="bg-card rounded-lg border p-4 animate-fade-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <stat.icon className="h-4 w-4" />
            <span className="text-xs font-medium">{stat.label}</span>
          </div>
          <p className="text-xl font-bold tabular-nums">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};
