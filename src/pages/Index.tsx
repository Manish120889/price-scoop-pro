import { useState, useMemo, useCallback } from "react";
import { Zap, Globe, Database } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { StatsBar } from "@/components/StatsBar";
import { AIChatPanel } from "@/components/AIChatPanel";
import { mockProducts, type Store } from "@/lib/mockData";
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

    if (selectedStores.length > 0) {
      results = results.filter((p) => selectedStores.includes(p.store));
    }

    if (selectedCategory) {
      results = results.filter((p) => p.category === selectedCategory);
    }

    results.sort((a, b) => {
      switch (sortBy) {
        case "discount": {
          const dA = (a.originalPrice - a.currentPrice) / a.originalPrice;
          const dB = (b.originalPrice - b.currentPrice) / b.originalPrice;
          return dB - dA;
        }
        case "lowest":
          return a.currentPrice - b.currentPrice;
        case "drop":
          return (b.originalPrice - b.currentPrice) - (a.originalPrice - a.currentPrice);
        default:
          return 0;
      }
    });

    return results;
  }, [query, selectedStores, selectedCategory, sortBy, products, dataSource]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">DealRadar</h1>
              <p className="text-xs text-muted-foreground">Track prices. Find deals.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {dataSource === "live" ? (
              <span className="flex items-center gap-1 px-2 py-1 bg-savings/10 text-savings rounded-full font-medium">
                <Globe className="h-3 w-3" /> Live Data
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-full">
                <Database className="h-3 w-3" /> Local Catalog
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Hero text */}
        <div className="animate-fade-up">
          <h2 className="text-3xl font-bold tracking-tight leading-tight" style={{ lineHeight: '1.1' }}>
            Find the best deals across top stores
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Search any product to get <strong>real-time prices from Amazon</strong>, or browse our curated catalog of 54+ products across Best Buy, Walmart, and Target.
          </p>
        </div>

        {/* Search */}
        <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            selectedStores={selectedStores}
            onStoresChange={setSelectedStores}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onLiveSearch={handleLiveSearch}
            isSearching={isSearching}
          />
        </div>

        {/* Stats */}
        <StatsBar products={filtered} />

        {/* Source indicator */}
        {dataSource === "live" && liveProducts.length > 0 && (
          <div className="flex items-center gap-2 animate-fade-up">
            <span className="text-sm text-muted-foreground">
              Showing live Amazon results for "{query}"
            </span>
            <button
              onClick={() => { setDataSource("local"); setLiveProducts([]); }}
              className="text-xs text-primary hover:underline"
            >
              Back to local catalog
            </button>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {isSearching ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Searching Amazon for "{query}"...</span>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-lg font-medium text-muted-foreground">No products found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try a different search term or adjust your filters
              </p>
            </div>
          ) : (
            filtered.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${(i + 3) * 60}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-6 text-center text-xs text-muted-foreground">
        <p>DealRadar — Live data from Amazon via RapidAPI. Local catalog for Best Buy, Walmart & Target.</p>
      </footer>

      {/* AI Chat */}
      <AIChatPanel />
    </div>
  );
};

export default Index;
