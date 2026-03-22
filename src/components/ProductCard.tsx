import { TrendingDown, Star, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Product } from "@/lib/mockData";
import { PriceChart } from "./PriceChart";

const storeBadgeClass: Record<string, string> = {
  Amazon: "bg-store-amazon/10 text-store-amazon",
  "Best Buy": "bg-store-bestbuy/10 text-store-bestbuy",
  Walmart: "bg-store-walmart/10 text-store-walmart",
  Target: "bg-store-target/10 text-store-target",
};

export const ProductCard = ({ product }: { product: Product }) => {
  const discount = Math.round(
    ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
  );
  const savingsAmount = product.originalPrice - product.currentPrice;
  const nearLowest = product.currentPrice <= product.lowestPrice * 1.05;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-48 h-48 sm:h-auto overflow-hidden bg-muted flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discount >= 20 && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2.5 py-1 rounded-md text-sm font-semibold shadow-md">
              -{discount}%
            </div>
          )}
          {nearLowest && (
            <div className="absolute top-3 right-3 bg-savings text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
              <TrendingDown className="h-3 w-3" /> Near Lowest
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${storeBadgeClass[product.store]}`}
                >
                  {product.store}
                </span>
                <span className="text-xs text-muted-foreground">{product.category}</span>
              </div>
              <h3 className="font-semibold text-base leading-snug line-clamp-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{product.brand}</p>
            </div>
            <a
              href={product.url}
              className="p-2 rounded-md hover:bg-secondary transition-colors flex-shrink-0"
              title="View on store"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>

          {/* Price block */}
          <div className="flex items-end gap-3 mb-3">
            <span className="text-2xl font-bold tracking-tight tabular-nums">
              ${product.currentPrice.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground line-through tabular-nums">
              ${product.originalPrice.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-savings tabular-nums">
              Save ${savingsAmount.toFixed(2)}
            </span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              <span className="font-medium tabular-nums">{product.rating}</span>
              <span>({product.reviewCount.toLocaleString()})</span>
            </div>
            <div>
              All-time low:{" "}
              <span className="font-semibold text-foreground tabular-nums">
                ${product.lowestPrice}
              </span>{" "}
              <span className="text-muted-foreground">
                on {new Date(product.lowestPriceDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>

          {/* Mini chart */}
          <div className="h-24 mt-auto">
            <PriceChart data={product.priceHistory} lowest={product.lowestPrice} />
          </div>
        </div>
      </div>
    </Card>
  );
};
