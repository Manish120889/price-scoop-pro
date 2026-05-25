import { TrendingDown, Star, ExternalLink } from "lucide-react";
import type { Product } from "@/lib/mockData";
import { PriceChart } from "./PriceChart";

const storeBadgeClass: Record<string, string> = {
  Amazon: "bg-store-amazon/15 text-store-amazon",
  "Best Buy": "bg-store-bestbuy/15 text-store-bestbuy",
  Walmart: "bg-store-walmart/15 text-store-walmart",
  Target: "bg-store-target/15 text-store-target",
};

const StarRow = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < full
              ? "fill-star text-star"
              : i === full && half
                ? "fill-star/50 text-star"
                : "fill-muted text-muted-foreground/40"
          }`}
        />
      ))}
    </div>
  );
};

export const ProductCard = ({ product }: { product: Product }) => {
  const discount = Math.round(
    ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
  );
  const savingsAmount = product.originalPrice - product.currentPrice;
  const nearLowest = product.currentPrice <= product.lowestPrice * 1.05;

  return (
    <article className="group bg-card border border-border hover:border-primary/60 hover:shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.25)] transition-all duration-200 rounded-md overflow-hidden flex flex-col h-full">
      {/* Image */}
      <a href={product.url} className="relative aspect-square bg-white block overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        {discount >= 15 && (
          <div className="absolute top-2 left-2 bg-deal text-deal-foreground px-2 py-0.5 rounded text-xs font-bold shadow">
            -{discount}%
          </div>
        )}
        {nearLowest && (
          <div className="absolute top-2 right-2 bg-savings text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
            <TrendingDown className="h-3 w-3" /> LOW
          </div>
        )}
        <span
          className={`absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${storeBadgeClass[product.store]}`}
        >
          {product.store}
        </span>
      </a>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <h3 className="text-sm font-medium leading-snug line-clamp-2 text-foreground hover:text-link cursor-pointer">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground -mt-0.5">{product.brand} · {product.category}</p>

        <div className="flex items-center gap-1.5">
          <StarRow rating={product.rating} />
          <a href="#" className="text-xs text-link hover:underline tabular-nums">
            {product.reviewCount.toLocaleString()}
          </a>
        </div>

        {/* Price block */}
        <div className="mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-foreground mt-1">$</span>
            <span className="text-2xl font-bold tracking-tight tabular-nums leading-none text-foreground">
              {Math.floor(product.currentPrice)}
            </span>
            <span className="text-sm font-bold tabular-nums text-foreground">
              {(product.currentPrice % 1).toFixed(2).slice(2)}
            </span>
            <span className="text-xs text-muted-foreground line-through tabular-nums ml-1">
              ${product.originalPrice.toLocaleString()}
            </span>
          </div>
          <div className="text-xs font-semibold text-savings tabular-nums mt-0.5">
            Save ${savingsAmount.toFixed(2)} ({discount}% off)
          </div>
        </div>

        <div className="text-[11px] text-muted-foreground border-t border-border pt-1.5 mt-1">
          All-time low{" "}
          <span className="font-semibold text-foreground tabular-nums">
            ${product.lowestPrice}
          </span>{" "}
          · {new Date(product.lowestPriceDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </div>

        {/* Mini chart */}
        <div className="h-14 -mx-1 mt-auto">
          <PriceChart data={product.priceHistory} lowest={product.lowestPrice} />
        </div>

        <a
          href={product.url}
          className="mt-1 w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold py-2 rounded-full text-center transition-colors flex items-center justify-center gap-1.5 border border-primary/80 shadow-sm"
        >
          View on {product.store}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </article>
  );
};
