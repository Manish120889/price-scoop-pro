import { useState, useMemo } from "react";
import { Zap } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { StatsBar } from "@/components/StatsBar";
import { AIChatPanel } from "@/components/AIChatPanel";
import { mockProducts, type Store } from "@/lib/mockData";

const Index = () => {
  const [query, setQuery] = useState("");
  const [selectedStores, setSelectedStores] = useState<Store[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("discount");

  const filtered = useMemo(() => {
    let results = [...mockProducts];

    if (query.trim()) {
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
  }, [query, selectedStores, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">DealRadar</h1>
              <p className="text-xs text-muted-foreground">Track prices. Find deals.</p>
            </div>
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
            Search any product, brand, or category to see current discounts, price history, and all-time lowest prices from Amazon, Best Buy, Walmart, and Target.
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
          />
        </div>

        {/* Stats */}
        <StatsBar products={filtered} />

        {/* Results */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
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
        <p>DealRadar — Price data is simulated for demonstration purposes.</p>
      </footer>

      {/* AI Chat */}
      <AIChatPanel />
    </div>
  );
};

export default Index;
