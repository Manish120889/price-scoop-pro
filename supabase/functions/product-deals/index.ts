import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY");
    if (!RAPIDAPI_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "Product API not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching deals for:", query);

    const params = new URLSearchParams({
      query: query.trim(),
      page: "1",
      country: "US",
      sort_by: "RELEVANCE",
      deal_type: "ALL_DEALS",
    });

    const response = await fetch(
      `https://real-time-amazon-data.p.rapidapi.com/deals-v2?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      // Fall back to regular search with price sort
      const searchParams = new URLSearchParams({
        query: query.trim(),
        page: "1",
        country: "US",
        sort_by: "LOWEST_PRICE",
      });

      const searchResp = await fetch(
        `https://real-time-amazon-data.p.rapidapi.com/search?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
          },
        }
      );

      if (!searchResp.ok) {
        const errText = await searchResp.text();
        console.error("Search fallback error:", searchResp.status, errText);
        return new Response(
          JSON.stringify({ success: false, error: "Could not fetch deals" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const searchData = await searchResp.json();
      return new Response(
        JSON.stringify({ success: true, deals: searchData?.data?.products || [], source: "search" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    return new Response(
      JSON.stringify({ success: true, deals: data?.data?.deals || data?.data?.products || [], source: "deals" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("deals-search error:", e);
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
