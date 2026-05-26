import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";
import { ArrowUpRight, Clock } from "lucide-react";

type Recipe = {
  id: string; slug: string; title: string; description: string | null; hero_image: string | null;
  category: string; prep_minutes: number | null; cook_minutes: number | null;
  calories: number | null; protein_g: number | null; carbs_g: number | null; fats_g: number | null;
};

const cats = ["all", "breakfast", "mains", "snacks", "drinks", "desserts"];

export default function Recipes() {
  const [items, setItems] = useState<Recipe[]>([]);
  const [cat, setCat] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("recipes").select("*").eq("published", true).order("created_at", { ascending: false })
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, []);

  const filtered = useMemo(() => cat === "all" ? items : items.filter((r) => r.category === cat), [items, cat]);

  return (
    <div className="min-h-screen bg-background text-foreground grain">
      <SiteNav />
      <section className="border-b border-ink/15">
        <div className="max-w-[1400px] mx-auto px-6 py-16">
          <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground flex items-center gap-2">
            <span className="h-px w-8 bg-ink/30" /> Recipes
          </div>
          <h1 className="mt-4 font-serif text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.95] tracking-[-0.03em]">
            High-protein.<br /><span className="italic font-light text-saffron">Honest food.</span>
          </h1>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-8 border-b border-ink/10 pb-4">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 text-xs uppercase tracking-wider ${cat === c ? "bg-ink text-ink-foreground" : "border border-ink/20 hover:bg-ink/5"}`}>
              {c}
            </button>
          ))}
        </div>
        {loading ? <p className="text-muted-foreground">Loading…</p> : filtered.length === 0 ? (
          <div className="border border-dashed border-ink/20 p-12 text-center text-muted-foreground">No recipes yet in this category.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r, i) => {
              const time = (r.prep_minutes ?? 0) + (r.cook_minutes ?? 0);
              return (
                <Link key={r.id} to={`/recipes/${r.slug}`} className="group border border-ink/15 bg-card hover:border-ink transition animate-[fadeUp_0.6s_cubic-bezier(.16,1,.3,1)_both]" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="aspect-[4/3] bg-[hsl(36_60%_88%)] overflow-hidden relative">
                    {r.hero_image ? <img src={r.hero_image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" /> : <div className="w-full h-full flex items-center justify-center text-7xl">🍽️</div>}
                    <span className="absolute top-3 left-3 bg-ink text-ink-foreground text-[10px] tracking-[0.2em] uppercase px-2 py-1">{r.category}</span>
                    {time > 0 && <span className="absolute top-3 right-3 bg-cream/90 px-2 py-1 text-[10px] font-mono flex items-center gap-1"><Clock className="h-3 w-3" />{time}m</span>}
                  </div>
                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-serif text-2xl font-semibold leading-tight">{r.title}</h3>
                      <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/40 group-hover:text-saffron transition" />
                    </div>
                    <div className="mt-4 flex items-end justify-between border-t border-ink/10 pt-3">
                      <div>
                        <div className="font-serif text-3xl font-bold tabular-nums">{r.calories ?? "—"}</div>
                        <div className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">kcal</div>
                      </div>
                      <div className="flex gap-3 text-[11px] font-mono">
                        <span><span className="text-muted-foreground">P</span> <strong>{r.protein_g ?? 0}g</strong></span>
                        <span><span className="text-muted-foreground">C</span> <strong>{r.carbs_g ?? 0}g</strong></span>
                        <span><span className="text-muted-foreground">F</span> <strong>{r.fats_g ?? 0}g</strong></span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
