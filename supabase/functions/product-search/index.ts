import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, category, page, country } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Search query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY");
    if (!RAPIDAPI_KEY) {
      console.error("RAPIDAPI_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Product API not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const params = new URLSearchParams({
      query: query.trim(),
      page: String(page || 1),
      country: country || "US",
      sort_by: "RELEVANCE",
    });
    if (category) params.set("category_id", category);

    console.log("Searching Amazon for:", query.trim());

    const response = await fetch(
      `https://real-time-amazon-data.p.rapidapi.com/search?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("RapidAPI error:", response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: `Product API error (${response.status})` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log(`Found ${data?.data?.products?.length || 0} products`);

    // Transform to our standard format
    const products = (data?.data?.products || []).map((p: any, i: number) => ({
      id: `amazon-${p.asin || i}`,
      asin: p.asin,
      name: p.product_title || "Unknown Product",
      brand: extractBrand(p.product_title),
      category: p.climate_pledge_friendly ? "Eco-Friendly" : "General",
      image: p.product_photo || p.product_url,
      store: "Amazon" as const,
      currentPrice: parsePrice(p.product_price),
      originalPrice: parsePrice(p.product_original_price) || parsePrice(p.product_price) * 1.15,
      lowestPrice: parsePrice(p.product_minimum_offer_price) || parsePrice(p.product_price) * 0.85,
      lowestPriceDate: "N/A",
      highestDiscount: calculateDiscount(p.product_price, p.product_original_price),
      url: p.product_url || "#",
      rating: parseFloat(p.product_star_rating) || 0,
      reviewCount: parseInt(String(p.product_num_ratings || "0").replace(/,/g, ""), 10) || 0,
      isPrime: p.is_prime || false,
      delivery: p.delivery || "",
      badge: p.product_badge || "",
      hasDeal: !!p.product_original_price && p.product_original_price !== p.product_price,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        products,
        totalResults: data?.data?.total_products || products.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("product-search error:", e);
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Search failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function parsePrice(priceStr: string | null | undefined): number {
  if (!priceStr) return 0;
  const cleaned = String(priceStr).replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
}

function extractBrand(title: string | null): string {
  if (!title) return "Unknown";
  const words = title.split(" ");
  return words[0] || "Unknown";
}

function calculateDiscount(current: string | null, original: string | null): number {
  const c = parsePrice(current);
  const o = parsePrice(original);
  if (!c || !o || o <= c) return 0;
  return Math.round(((o - c) / o) * 100);
}
