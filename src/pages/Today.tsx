import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/hooks/useAuth";
import {
  Heart, Activity, TrendingUp, Flame, Dumbbell, Calendar, ArrowRight,
  Crown, Sparkles, Target, Lock, Zap,
} from "lucide-react";

type Recipe = {
  id: string; slug: string; title: string; hero_image: string | null;
  calories: number | null; protein_g: number | null; carbs_g: number | null; fats_g: number | null;
};
type Log = {
  id: string; log_date: string; weight_kg: number | null;
  workout_completed: boolean | null; notes: string | null;
};

export default function Today() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [allWorkoutDates, setAllWorkoutDates] = useState<string[]>([]);
  const [programTotals, setProgramTotals] = useState({ done: 0, total: 0 });
  const [premiumCount, setPremiumCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    (async () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

      const [favRes, logsRes, allLogsRes, doneRes, daysRes, premRes] = await Promise.all([
        supabase.from("favorites").select("item_id").eq("user_id", user.id).eq("item_type", "recipe"),
        supabase.from("progress_logs").select("*").eq("user_id", user.id).gte("log_date", sevenDaysAgo).order("log_date", { ascending: false }),
        supabase.from("progress_logs").select("log_date").eq("user_id", user.id).eq("workout_completed", true).order("log_date", { ascending: false }).limit(365),
        supabase.from("progress_logs").select("program_day_id").eq("user_id", user.id).eq("workout_completed", true).not("program_day_id", "is", null),
        supabase.from("program_days").select("id, is_rest_day"),
        supabase.from("recipes").select("id", { count: "exact", head: true }).contains("tags", ["premium"]),
      ]);

      const ids = (favRes.data ?? []).map((f) => f.item_id);
      if (ids.length) {
        const { data: recipes } = await supabase.from("recipes").select("id, slug, title, hero_image, calories, protein_g, carbs_g, fats_g").in("id", ids);
        setFavorites(recipes ?? []);
      }
      setLogs((logsRes.data ?? []) as Log[]);
      setAllWorkoutDates((allLogsRes.data ?? []).map((l: any) => l.log_date));

      const doneDayIds = new Set((doneRes.data ?? []).map((d: any) => d.program_day_id));
      const workoutDays = (daysRes.data ?? []).filter((d: any) => !d.is_rest_day);
      const done = workoutDays.filter((d: any) => doneDayIds.has(d.id)).length;
      setProgramTotals({ done, total: workoutDays.length });
      setPremiumCount(premRes.count ?? 0);
      setLoading(false);
    })();
  }, [user]);

  if (authLoading || loading) {
    return <div className="min-h-screen bg-light-bg"><SiteNav /><div className="max-w-[1400px] mx-auto px-6 py-12 text-muted-foreground">Loading your day…</div></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-light-bg text-foreground">
        <SiteNav />
        <div className="max-w-md mx-auto p-12 text-center">
          <h1 className="font-serif text-4xl font-black">Your day, in one view.</h1>
          <p className="mt-3 text-muted-foreground">Sign in to see your saved recipes, recent logs, and weekly stats.</p>
          <Link to="/auth" className="inline-block mt-6 bg-sage text-white px-5 py-3 text-sm uppercase tracking-wider font-semibold hover:bg-blue-green transition">Sign in</Link>
        </div>
      </div>
    );
  }

  // Stats
  const weightLogs = logs.filter((l) => l.weight_kg != null);
  const currentWeight = weightLogs[0]?.weight_kg ?? null;
  const workoutCount = logs.filter((l) => l.workout_completed).length;
  const avgProtein = favorites.length
    ? Math.round(favorites.reduce((a, r) => a + (r.protein_g ?? 0), 0) / favorites.length)
    : 0;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="min-h-screen bg-light-bg text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="border-b border-sage/20">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <p className="text-xs uppercase tracking-[0.25em] text-sage font-semibold">Today · {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
          <h1 className="mt-3 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[0.95]">
            {greeting}, <span className="text-sage">{user.email?.split("@")[0]}</span>.
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">Here's your week at a glance — saved recipes, recent logs, and how you're trending.</p>
        </div>
      </section>

      {/* Quick stats */}
      <section className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard icon={TrendingUp} label="Current weight" value={currentWeight != null ? `${currentWeight} kg` : "—"} sub={weightLogs.length > 1 ? `${weightLogs.length} logs this week` : "Log your first weight"} color="sage" />
          <StatCard icon={Dumbbell} label="Workouts this week" value={`${workoutCount}`} sub={workoutCount >= 3 ? "Crushing it." : "Aim for 3+ this week"} color="blue-green" />
          <StatCard icon={Flame} label="Avg protein (saved)" value={`${avgProtein}g`} sub={favorites.length ? `Across ${favorites.length} recipes` : "Save recipes to see"} color="earth" />
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 pb-16 grid lg:grid-cols-3 gap-10">
        {/* Favorites */}
        <section className="lg:col-span-2">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sage font-semibold flex items-center gap-2"><Heart className="h-3 w-3" /> Saved recipes</p>
              <h2 className="font-serif text-3xl font-bold mt-1">Your favorites</h2>
            </div>
            <Link to="/recipes" className="text-xs uppercase tracking-wider text-blue-green hover:text-sage inline-flex items-center gap-1">Browse all <ArrowRight className="h-3 w-3" /></Link>
          </div>

          {favorites.length === 0 ? (
            <EmptyCard
              title="No favorites yet"
              body="Tap the heart on any recipe to pin it here for easy access."
              cta={{ to: "/recipes", label: "Find recipes" }}
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {favorites.map((r) => (
                <Link key={r.id} to={`/recipes/${r.slug}`} className="group bg-white border border-sage/20 hover:border-sage transition overflow-hidden">
                  <div className="aspect-[4/3] bg-light-bg overflow-hidden">
                    {r.hero_image ? (
                      <img src={r.hero_image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-sage/20 to-blue-green/20" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-sage transition">{r.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono">
                      {r.calories != null && <span><strong className="text-foreground">{r.calories}</strong> kcal</span>}
                      {r.protein_g != null && <span><strong className="text-sage">{r.protein_g}g</strong> P</span>}
                      {r.carbs_g != null && <span><strong className="text-earth">{r.carbs_g}g</strong> C</span>}
                      {r.fats_g != null && <span><strong className="text-blue-green">{r.fats_g}g</strong> F</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent logs */}
        <section>
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sage font-semibold flex items-center gap-2"><Activity className="h-3 w-3" /> Last 7 days</p>
              <h2 className="font-serif text-3xl font-bold mt-1">Recent logs</h2>
            </div>
            <Link to="/tracker" className="text-xs uppercase tracking-wider text-blue-green hover:text-sage inline-flex items-center gap-1">Open <ArrowRight className="h-3 w-3" /></Link>
          </div>

          {logs.length === 0 ? (
            <EmptyCard
              title="Nothing logged yet"
              body="Add a weight, workout, or note to start building your streak."
              cta={{ to: "/tracker", label: "Log entry" }}
            />
          ) : (
            <ol className="space-y-3">
              {logs.map((l) => (
                <li key={l.id} className="bg-white border border-sage/20 p-4 flex gap-4">
                  <div className="shrink-0 w-12 text-center">
                    <Calendar className="h-4 w-4 mx-auto text-sage" />
                    <div className="mt-1 font-mono text-[10px] text-muted-foreground uppercase">
                      {new Date(l.log_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-3 text-sm">
                      {l.weight_kg != null && <span className="font-semibold text-sage">{l.weight_kg} kg</span>}
                      {l.workout_completed && <span className="text-blue-green font-semibold">✓ Workout</span>}
                      {l.weight_kg == null && !l.workout_completed && <span className="text-muted-foreground">Note</span>}
                    </div>
                    {l.notes && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{l.notes}</p>}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub: string; color: "sage" | "blue-green" | "earth" }) {
  const bg = color === "sage" ? "bg-sage" : color === "blue-green" ? "bg-blue-green" : "bg-earth";
  return (
    <div className="bg-white border border-sage/20 p-5 flex items-start gap-4">
      <div className={`${bg} text-white p-3 rounded-full shrink-0`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-1 font-serif text-3xl font-black leading-tight">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

function EmptyCard({ title, body, cta }: { title: string; body: string; cta: { to: string; label: string } }) {
  return (
    <div className="bg-white border border-dashed border-sage/40 p-8 text-center">
      <h3 className="font-serif text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <Link to={cta.to} className="inline-block mt-4 bg-sage text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-blue-green transition">{cta.label}</Link>
    </div>
  );
}
