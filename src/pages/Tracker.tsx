import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { TrendingUp, Calendar, Activity } from "lucide-react";

export default function Tracker() {
  const { user, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("progress_logs").select("*").eq("user_id", user.id).order("log_date", { ascending: false }).limit(30);
    setLogs(data ?? []);
  };

  useEffect(() => { load(); }, [user]);

  const addLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("progress_logs").insert({
      user_id: user.id, log_date: date,
      weight_kg: weight ? parseFloat(weight) : null,
      notes: notes || null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Logged"); setWeight(""); setNotes(""); load(); }
  };

  if (authLoading) return <div className="min-h-screen bg-background"><SiteNav /></div>;
  if (!user) return (
    <div className="min-h-screen bg-background text-foreground grain">
      <SiteNav />
      <div className="max-w-md mx-auto p-12 text-center">
        <h1 className="font-serif text-4xl font-black">Sign in to track</h1>
        <p className="mt-3 text-muted-foreground">Log workouts, weight, and notes — all in one place.</p>
        <Link to="/auth" className="inline-block mt-6 bg-ink text-ink-foreground px-5 py-3 text-sm uppercase tracking-wider font-semibold hover:bg-saffron">Sign in</Link>
      </div>
    </div>
  );

  const workoutsDone = logs.filter((l) => l.workout_completed).length;
  const weights = logs.filter((l) => l.weight_kg).map((l) => l.weight_kg);
  const avgWeight = weights.length ? (weights.reduce((a, b) => a + +b, 0) / weights.length).toFixed(1) : "—";

  return (
    <div className="min-h-screen bg-background text-foreground grain">
      <SiteNav />
      <section className="border-b border-ink/15">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-black leading-[0.95]">Your tracker.</h1>
          <p className="mt-3 text-muted-foreground">Last 30 days at a glance.</p>
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="border border-ink/15 bg-card p-5"><Activity className="h-5 w-5 text-saffron" /><div className="mt-3 font-serif text-4xl font-black">{workoutsDone}</div><div className="text-xs uppercase tracking-wider text-muted-foreground">Workouts</div></div>
            <div className="border border-ink/15 bg-card p-5"><TrendingUp className="h-5 w-5 text-saffron" /><div className="mt-3 font-serif text-4xl font-black">{avgWeight}</div><div className="text-xs uppercase tracking-wider text-muted-foreground">Avg weight (kg)</div></div>
            <div className="border border-ink/15 bg-card p-5"><Calendar className="h-5 w-5 text-saffron" /><div className="mt-3 font-serif text-4xl font-black">{logs.length}</div><div className="text-xs uppercase tracking-wider text-muted-foreground">Logs</div></div>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
        <form onSubmit={addLog} className="border border-ink/15 bg-card p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl font-bold">Add entry</h2>
          <div className="mt-4 space-y-3">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-ink/20 px-3 py-2 bg-background text-sm" />
            <input type="number" step="0.1" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full border border-ink/20 px-3 py-2 bg-background text-sm" />
            <textarea placeholder="Notes — how you felt, what you ate, what you trained" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full border border-ink/20 px-3 py-2 bg-background text-sm" />
            <button className="w-full bg-ink text-ink-foreground py-3 text-sm uppercase tracking-wider font-semibold hover:bg-saffron">Save log</button>
          </div>
        </form>

        <div className="lg:col-span-2">
          <h2 className="font-serif text-2xl font-bold mb-4">History</h2>
          {logs.length === 0 ? <p className="text-muted-foreground">No logs yet. Add your first entry.</p> : (
            <div className="space-y-2">
              {logs.map((l) => (
                <div key={l.id} className="border border-ink/15 bg-card p-4 flex items-start gap-5">
                  <div className="font-mono text-xs text-muted-foreground w-20 shrink-0">{l.log_date}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-3 text-sm">
                      {l.weight_kg && <span><strong>{l.weight_kg}kg</strong></span>}
                      {l.workout_completed && <span className="text-saffron">✓ Workout</span>}
                    </div>
                    {l.notes && <p className="mt-1 text-sm text-muted-foreground">{l.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
