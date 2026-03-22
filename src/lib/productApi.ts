import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/mockData";

export type LiveProduct = {
  id: string;
  asin?: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  store: "Amazon";
  currentPrice: number;
  originalPrice: number;
  lowestPrice: number;
  lowestPriceDate: string;
  highestDiscount: number;
  url: string;
  rating: number;
  reviewCount: number;
  isPrime?: boolean;
  delivery?: string;
  badge?: string;
  hasDeal?: boolean;
  priceHistory: { date: string; price: number }[];
};

function generateFakePriceHistory(current: number, original: number, lowest: number) {
  const points = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const range = original - lowest;
    const noise = (Math.random() - 0.4) * range * 0.5;
    let price = current + noise;
    if (i === 3) price = lowest;
    if (i === 6) price = original;
    if (i === 0) price = current;
    price = Math.max(lowest * 0.95, Math.min(original * 1.02, price));
    points.push({ date: date.toISOString().split("T")[0], price: Math.round(price * 100) / 100 });
  }
  return points;
}

export async function searchProducts(query: string): Promise<{ products: LiveProduct[]; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke("product-search", {
      body: { query },
    });

    if (error) {
      console.error("Search error:", error);
      return { products: [], error: error.message };
    }

    if (!data?.success) {
      return { products: [], error: data?.error || "Search failed" };
    }

    const products: LiveProduct[] = (data.products || [])
      .filter((p: any) => p.currentPrice > 0)
      .map((p: any) => ({
        ...p,
        priceHistory: generateFakePriceHistory(p.currentPrice, p.originalPrice, p.lowestPrice),
      }));

    return { products };
  } catch (e) {
    console.error("searchProducts error:", e);
    return { products: [], error: e instanceof Error ? e.message : "Network error" };
  }
}

export function liveProductToProduct(lp: LiveProduct): Product {
  return {
    id: lp.id,
    name: lp.name,
    brand: lp.brand,
    category: lp.category,
    image: lp.image,
    store: lp.store,
    currentPrice: lp.currentPrice,
    originalPrice: lp.originalPrice,
    lowestPrice: lp.lowestPrice,
    lowestPriceDate: lp.lowestPriceDate,
    highestDiscount: lp.highestDiscount,
    url: lp.url,
    rating: lp.rating,
    reviewCount: lp.reviewCount,
    priceHistory: lp.priceHistory,
  };
}
