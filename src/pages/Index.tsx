import { useState, useMemo, useCallback } from "react";
import { Search, MapPin, Menu, ShoppingCart, ChevronDown, Globe, Database, Loader2, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { StatsBar } from "@/components/StatsBar";
import { AIChatPanel } from "@/components/AIChatPanel";
import { mockProducts, stores, categories, type Store } from "@/lib/mockData";
import { searchProducts, liveProductToProduct } from "@/lib/productApi";
import type { Product } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [query, setQuery] = useState("");
  const [selectedStores, setSelectedStores] = useState<Store[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("discount");
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dataSource, setDataSource] = useState<"local" | "live">("local");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { toast } = useToast();

  const handleLiveSearch = useCallback(async () => {
    if (!query.trim()) {
      setDataSource("local");
      setLiveProducts([]);
      return;
    }
    setIsSearching(true);
    setDataSource("live");
    try {
      const result = await searchProducts(query);
      if (result.error) {
        toast({ title: "Search issue", description: result.error, variant: "destructive" });
        setDataSource("local");
      } else if (result.products.length === 0) {
        toast({ title: "No results", description: "No live results found. Showing local catalog." });
        setDataSource("local");
      } else {
        setLiveProducts(result.products.map(liveProductToProduct));
        toast({ title: `Found ${result.products.length} live products`, description: "Showing real-time Amazon results" });
      }
    } catch {
      toast({ title: "Search failed", description: "Falling back to local catalog", variant: "destructive" });
      setDataSource("local");
    }
    setIsSearching(false);
  }, [query, toast]);

  const products = dataSource === "live" ? liveProducts : mockProducts;

  const filtered = useMemo(() => {
    let results = [...products];
    if (query.trim() && dataSource === "local") {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (selectedStores.length > 0) results = results.filter((p) => selectedStores.includes(p.store));
    if (selectedCategory) results = results.filter((p) => p.category === selectedCategory);
    results.sort((a, b) => {
      switch (sortBy) {
        case "discount": {
          const dA = (a.originalPrice - a.currentPrice) / a.originalPrice;
          const dB = (b.originalPrice - b.currentPrice) / b.originalPrice;
          return dB - dA;
        }
        case "lowest": return a.currentPrice - b.currentPrice;
        case "drop": return (b.originalPrice - b.currentPrice) - (a.originalPrice - a.currentPrice);
        default: return 0;
      }
    });
    return results;
  }, [query, selectedStores, selectedCategory, sortBy, products, dataSource]);

  const toggleStore = (s: Store) =>
    setSelectedStores(selectedStores.includes(s) ? selectedStores.filter((x) => x !== s) : [...selectedStores, s]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav — Amazon-style dark bar */}
      <header className="sticky top-0 z-50 shadow-md">
        <div className="bg-nav text-nav-foreground">
          <div className="max-w-[1500px] mx-auto px-3 py-2 flex items-center gap-2">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 px-2 py-1.5 rounded border border-transparent hover:border-nav-foreground/40 transition">
              <div className="h-7 w-7 rounded bg-primary flex items-center justify-center font-black text-nav text-sm">D</div>
              <div className="leading-tight hidden sm:block">
                <div className="text-[10px] text-nav-foreground/70">Hello, deal hunter</div>
                <div className="text-sm font-bold">DealRadar<span className="text-primary">.</span></div>
              </div>
            </a>

            {/* Location */}
            <button className="hidden md:flex items-start gap-1 px-2 py-1.5 rounded border border-transparent hover:border-nav-foreground/40 transition">
              <MapPin className="h-4 w-4 mt-2 text-nav-foreground/70" />
              <div className="text-left leading-tight">
                <div className="text-[10px] text-nav-foreground/70">Deliver to</div>
                <div className="text-sm font-bold">United States</div>
              </div>
            </button>

            {/* Search bar (Amazon style: category picker + input + button) */}
            <div className="flex-1 flex h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-secondary text-foreground text-xs font-medium px-2 border-r border-border hover:bg-muted cursor-pointer outline-none"
              >
                <option value="">All</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && query.trim()) handleLiveSearch(); }}
                placeholder="Search any product — press Enter for live Amazon results"
                className="flex-1 px-3 text-sm bg-white text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={handleLiveSearch}
                disabled={!query.trim() || isSearching}
                className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground px-4 flex items-center justify-center transition"
                aria-label="Search"
              >
                {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              </button>
            </div>

            {/* Right meta */}
            <div className="hidden lg:flex items-center gap-3 text-sm">
              <button className="px-2 py-1.5 rounded border border-transparent hover:border-nav-foreground/40 leading-tight text-left">
                <div className="text-[10px] text-nav-foreground/70">Hello, sign in</div>
                <div className="font-bold flex items-center gap-0.5">Account & Lists <ChevronDown className="h-3 w-3" /></div>
              </button>
              <button className="px-2 py-1.5 rounded border border-transparent hover:border-nav-foreground/40 leading-tight text-left">
                <div className="text-[10px] text-nav-foreground/70">Track your</div>
                <div className="font-bold">Price Drops</div>
              </button>
              <button className="flex items-center gap-1 px-2 py-1.5 rounded border border-transparent hover:border-nav-foreground/40 font-bold">
                <ShoppingCart className="h-6 w-6" />
                <span className="text-xs">Watchlist</span>
              </button>
            </div>
          </div>

          {/* Sub-nav */}
          <div className="bg-nav-light text-nav-foreground text-sm">
            <div className="max-w-[1500px] mx-auto px-3 py-1.5 flex items-center gap-4 overflow-x-auto">
              <button className="flex items-center gap-1 font-bold px-2 py-0.5 rounded hover:border hover:border-nav-foreground/40 border border-transparent whitespace-nowrap">
                <Menu className="h-4 w-4" /> All
              </button>
              {["Today's Deals", "Lightning Deals", "Coupons", "Outlet", "Trending", ...categories.slice(0, 6)].map((item) => (
                <button key={item} className="px-2 py-0.5 hover:border hover:border-nav-foreground/40 border border-transparent rounded whitespace-nowrap">
                  {item}
                </button>
              ))}
              <button className="ml-auto text-primary font-bold px-2 py-0.5 whitespace-nowrap">
                {dataSource === "live" ? <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Live</span> : <span className="flex items-center gap-1 text-nav-foreground/80"><Database className="h-3 w-3" /> Local</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Hero ribbon */}
        <div className="bg-gradient-to-r from-nav via-nav-light to-nav text-nav-foreground border-b-4 border-primary">
          <div className="max-w-[1500px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <p className="text-sm">
              <span className="font-bold text-primary">Today's Deals</span> · Tracking{" "}
              <span className="font-bold">{mockProducts.length}+ products</span> across Amazon, Best Buy, Walmart & Target —{" "}
              <a href="#deals" className="underline hover:text-primary">see all savings →</a>
            </p>
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="hidden md:flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-bold hover:bg-primary/90 transition"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Refine
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1500px] mx-auto px-4 py-5 space-y-5">
        {/* Filter rail (collapsible) */}
        {filtersOpen && (
          <div className="bg-card border border-border rounded-md p-4 space-y-3 animate-fade-up">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Stores</p>
                <div className="flex flex-wrap gap-2">
                  {stores.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleStore(s)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                        selectedStores.includes(s)
                          ? "bg-nav text-nav-foreground border-nav"
                          : "bg-card border-border hover:border-primary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Sort by</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "discount", label: "Highest Discount" },
                    { value: "lowest", label: "Lowest Price" },
                    { value: "drop", label: "Biggest Drop" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                        sortBy === opt.value
                          ? "bg-nav text-nav-foreground border-nav"
                          : "bg-card border-border hover:border-primary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <StatsBar products={filtered} />

        {/* Section header */}
        <div className="flex items-end justify-between border-b border-border pb-2" id="deals">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              {dataSource === "live" ? `Live results for "${query}"` : "Today's hottest deals"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filtered.length} results
              {dataSource === "live" && (
                <button
                  onClick={() => { setDataSource("local"); setLiveProducts([]); }}
                  className="ml-2 text-link hover:underline"
                >
                  ← back to local catalog
                </button>
              )}
            </p>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs border border-border bg-card rounded px-2 py-1.5 font-medium"
          >
            <option value="discount">Sort: Highest Discount</option>
            <option value="lowest">Sort: Lowest Price</option>
            <option value="drop">Sort: Biggest Drop</option>
          </select>
        </div>

        {/* Results grid */}
        {isSearching ? (
          <div className="text-center py-20 animate-fade-in">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="mt-3 text-sm text-muted-foreground">Searching Amazon for "{query}"...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-lg font-bold">No products found</p>
            <p className="text-sm text-muted-foreground mt-1">Try a different search or clear filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((product, i) => (
              <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-nav text-nav-foreground mt-12">
        <div className="bg-nav-light text-center py-4 text-sm hover:bg-nav-light/80 cursor-pointer">
          Back to top
        </div>
        <div className="max-w-[1500px] mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <h4 className="font-bold mb-2">Get to Know Us</h4>
            <ul className="space-y-1 text-nav-foreground/70">
              <li>About DealRadar</li><li>How tracking works</li><li>Careers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Tools</h4>
            <ul className="space-y-1 text-nav-foreground/70">
              <li>Price History</li><li>Alerts</li><li>Browser Extension</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Stores</h4>
            <ul className="space-y-1 text-nav-foreground/70">
              {stores.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Help</h4>
            <ul className="space-y-1 text-nav-foreground/70">
              <li>Contact</li><li>Privacy</li><li>Terms</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-nav-light text-center py-4 text-xs text-nav-foreground/60">
          © DealRadar — Live data via RapidAPI. Not affiliated with Amazon.com, Inc.
        </div>
      </footer>

      <AIChatPanel />
    </div>
  );
};

export default Index;
