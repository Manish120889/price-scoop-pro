import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { stores, categories, type Store } from "@/lib/mockData";

type Props = {
  query: string;
  onQueryChange: (q: string) => void;
  selectedStores: Store[];
  onStoresChange: (s: Store[]) => void;
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
  sortBy: string;
  onSortChange: (s: string) => void;
};

export const SearchBar = ({
  query,
  onQueryChange,
  selectedStores,
  onStoresChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: Props) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleStore = (store: Store) => {
    onStoresChange(
      selectedStores.includes(store)
        ? selectedStores.filter((s) => s !== store)
        : [...selectedStores, store]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product, brand, or category..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="pl-10 h-12 text-base bg-card border-border shadow-sm"
          />
        </div>
        <Button
          variant={filtersOpen ? "default" : "outline"}
          size="lg"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="h-12 gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {filtersOpen && (
        <div className="bg-card rounded-lg border p-4 space-y-4 animate-fade-up">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Stores</p>
            <div className="flex flex-wrap gap-2">
              {stores.map((store) => (
                <button
                  key={store}
                  onClick={() => toggleStore(store)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all active:scale-95 ${
                    selectedStores.includes(store)
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {store}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onCategoryChange("")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all active:scale-95 ${
                    !selectedCategory
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all active:scale-95 ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Sort by</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "discount", label: "Highest Discount" },
                  { value: "lowest", label: "Lowest Price" },
                  { value: "drop", label: "Biggest Drop" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onSortChange(opt.value)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all active:scale-95 ${
                      sortBy === opt.value
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
    </div>
  );
};
