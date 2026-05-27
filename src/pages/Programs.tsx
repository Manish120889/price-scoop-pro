import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";
import { ArrowUpRight, Calendar, Dumbbell, Flame, Sparkles } from "lucide-react";

type Program = {
  id: string; slug: string; title: string; description: string | null;
  hero_image: string | null; duration_weeks: number | null; level: string | null; category: string | null;
};

const LEVEL_COLOR: Record<string, string> = {
  beginner: "bg-sage",
  intermediate: "bg-blue-green",
  advanced: "bg-earth",
};

export default function Programs() {
  const [items, setItems] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    supabase.from("programs").select("*").eq("published", true).order("created_at", { ascending: false })
      .then(({ data }) => { setItems((data ?? []) as Program[]); setLoading(false); });
  }, []);

  const levels = Array.from(new Set(items.map((i) => i.level).filter(Boolean))) as string[];
  const filtered = filter === "all" ? items : items.filter((i) => i.level === filter);

  return (
    <div className="min-h-screen bg-light-bg text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="relative bg-sage text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative max-w-[1400px] mx-auto px-6 py-16 lg:py-24">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] font-bold">
            <Sparkles className="h-3 w-3 text-earth" /> Free Training Programs
          </div>
          <h1 className="mt-5 font-serif text-[clamp(2.75rem,7vw,5.5rem)] font-black leading-[0.95] tracking-[-0.02em] max-w-3xl">
            Train with intention.<br />
            <span className="text-earth italic font-light">Finish what you start.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            Multi-week plans with daily workouts, rest days, and video guidance. Pick your level and commit.
          </p>

          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <Pill icon={Calendar} label="2–8 week plans" />
            <Pill icon={Dumbbell} label="No equipment" />
            <Pill icon={Flame} label="All levels" />
          </div>
        </div>
      </section>

      {/* FILTERS */}
      {levels.length > 0 && (
        <section className="border-b border-sage/20 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex gap-2 overflow-x-auto">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All programs</FilterChip>
            {levels.map((l) => (
              <FilterChip key={l} active={filter === l} onClick={() => setFilter(l)}>
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </FilterChip>
            ))}
          </div>
        </section>
      )}

      {/* GRID */}
      <section className="max-w-[1400px] mx-auto px-6 py-12">
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-sage/40 bg-white p-12 text-center text-muted-foreground rounded-xl">
            No programs yet. Admins can add them from the Admin panel.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => {
              const lvl = (p.level ?? "beginner").toLowerCase();
              const lvlColor = LEVEL_COLOR[lvl] ?? "bg-sage";
              return (
                <Link
                  key={p.id}
                  to={`/programs/${p.slug}`}
                  className="group bg-white border border-sage/15 hover:border-sage rounded-2xl overflow-hidden transition shadow-sm hover:shadow-lg animate-[fadeUp_0.6s_cubic-bezier(.16,1,.3,1)_both]"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="aspect-[4/3] bg-light-bg overflow-hidden relative">
                    {p.hero_image ? (
                      <img
                        src={p.hero_image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-sage/30 to-blue-green/30 flex items-center justify-center text-7xl">💪</div>
                    )}
                    <span className={`${lvlColor} absolute top-3 left-3 text-white text-[10px] tracking-[0.2em] uppercase font-bold px-3 py-1.5 rounded-full`}>
                      {p.level}
                    </span>
                    <span className="absolute top-3 right-3 bg-white/95 backdrop-blur text-sage text-[10px] tracking-[0.2em] uppercase font-bold px-3 py-1.5 rounded-full">
                      {p.duration_weeks}w
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-serif text-2xl font-bold leading-tight group-hover:text-sage transition">{p.title}</h3>
                      <ArrowUpRight className="h-5 w-5 shrink-0 text-sage/40 group-hover:text-sage group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
                    </div>
                    {p.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.description}</p>}
                    <div className="mt-4 flex items-center gap-3 text-[11px] font-mono text-muted-foreground border-t border-sage/10 pt-3">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-sage" /> {p.duration_weeks} weeks</span>
                      <span className="flex items-center gap-1"><Flame className="h-3 w-3 text-earth" /> {p.category}</span>
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

function Pill({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-white/90">
      <span className="bg-white/15 backdrop-blur p-1.5 rounded-full"><Icon className="h-3.5 w-3.5 text-earth" /></span>
      {label}
    </span>
  );
}

function FilterChip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold border-2 transition ${
        active ? "bg-sage text-white border-sage" : "bg-white text-sage border-sage/30 hover:border-sage"
      }`}
    >
      {children}
    </button>
  );
}
