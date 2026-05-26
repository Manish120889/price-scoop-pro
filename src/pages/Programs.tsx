import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";
import { ArrowUpRight, Calendar, TrendingUp } from "lucide-react";

type Program = {
  id: string; slug: string; title: string; description: string | null;
  hero_image: string | null; duration_weeks: number | null; level: string | null; category: string | null;
};

export default function Programs() {
  const [items, setItems] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("programs").select("*").eq("published", true).order("created_at", { ascending: false })
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground grain">
      <SiteNav />
      <section className="border-b border-ink/15">
        <div className="max-w-[1400px] mx-auto px-6 py-16">
          <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground flex items-center gap-2">
            <span className="h-px w-8 bg-ink/30" /> Training Programs
          </div>
          <h1 className="mt-4 font-serif text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.95] tracking-[-0.03em]">
            Multi-week programs.<br /><span className="italic font-light text-saffron">Built to finish.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink/70">Structured training plans with daily workouts, rest days, and progressive overload. Pick your level and commit.</p>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 py-12">
        {loading ? <p className="text-muted-foreground">Loading…</p> : items.length === 0 ? (
          <div className="border border-dashed border-ink/20 p-12 text-center text-muted-foreground">
            No programs yet. Admins can add them from the Admin panel.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p, i) => (
              <Link key={p.id} to={`/programs/${p.slug}`} className="group border border-ink/15 bg-card hover:border-ink transition animate-[fadeUp_0.6s_cubic-bezier(.16,1,.3,1)_both]" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="aspect-[4/3] bg-[hsl(36_60%_88%)] overflow-hidden relative">
                  {p.hero_image ? <img src={p.hero_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" /> : <div className="w-full h-full flex items-center justify-center text-7xl">💪</div>}
                  <span className="absolute top-3 left-3 bg-ink text-ink-foreground text-[10px] tracking-[0.2em] uppercase font-semibold px-2 py-1">{p.level}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-2xl font-semibold leading-tight">{p.title}</h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/40 group-hover:text-saffron transition" />
                  </div>
                  {p.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.description}</p>}
                  <div className="mt-4 flex items-center gap-4 text-[11px] font-mono text-muted-foreground border-t border-ink/10 pt-3">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.duration_weeks}w</span>
                    <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {p.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
