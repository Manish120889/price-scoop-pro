import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Heart, Play, Clock } from "lucide-react";

export default function ProgramDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [program, setProgram] = useState<any>(null);
  const [days, setDays] = useState<any[]>([]);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from("programs").select("*").eq("slug", slug!).maybeSingle();
      if (!p) return;
      setProgram(p);
      const { data: d } = await supabase.from("program_days").select("*").eq("program_id", p.id).order("day_number");
      setDays(d ?? []);
      if (user) {
        const { data: f } = await supabase.from("favorites").select("id").eq("user_id", user.id).eq("item_type", "program").eq("item_id", p.id).maybeSingle();
        setFav(!!f);
      }
    })();
  }, [slug, user]);

  const toggleFav = async () => {
    if (!user) { toast.error("Sign in to save favorites"); return; }
    if (fav) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("item_type", "program").eq("item_id", program.id);
      setFav(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, item_type: "program", item_id: program.id });
      setFav(true);
    }
  };

  const logDay = async (dayId: string) => {
    if (!user) { toast.error("Sign in to log progress"); return; }
    await supabase.from("progress_logs").insert({ user_id: user.id, program_day_id: dayId, workout_completed: true });
    toast.success("Logged! Keep going.");
  };

  if (!program) return <div className="min-h-screen bg-background"><SiteNav /><div className="p-12 text-center text-muted-foreground">Loading…</div></div>;

  return (
    <div className="min-h-screen bg-background text-foreground grain">
      <SiteNav />
      <section className="border-b border-ink/15 grid lg:grid-cols-2">
        <div className="p-10 lg:p-16">
          <Link to="/programs" className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-saffron">← All programs</Link>
          <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.95]">{program.title}</h1>
          <div className="mt-4 flex gap-3 text-xs">
            <span className="bg-ink text-ink-foreground px-2 py-1 uppercase tracking-wider">{program.level}</span>
            <span className="border border-ink/20 px-2 py-1 uppercase tracking-wider">{program.duration_weeks} weeks</span>
            <span className="border border-ink/20 px-2 py-1 uppercase tracking-wider">{program.category}</span>
          </div>
          {program.description && <p className="mt-6 text-lg text-ink/70 leading-relaxed">{program.description}</p>}
          <button onClick={toggleFav} className={`mt-8 inline-flex items-center gap-2 px-5 py-3 text-sm uppercase tracking-wider font-semibold border ${fav ? "bg-saffron text-ink border-saffron" : "border-ink/20 hover:bg-ink/5"}`}>
            <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} /> {fav ? "Saved" : "Save program"}
          </button>
        </div>
        <div className="bg-[hsl(36_60%_88%)] aspect-[4/3] lg:aspect-auto overflow-hidden">
          {program.hero_image ? <img src={program.hero_image} alt={program.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10rem]">💪</div>}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 py-12">
        <h2 className="font-serif text-3xl font-bold mb-6">Daily schedule</h2>
        {days.length === 0 ? <p className="text-muted-foreground">No days added yet.</p> : (
          <div className="space-y-3">
            {days.map((d) => (
              <div key={d.id} className={`border border-ink/15 p-5 flex items-center justify-between gap-4 ${d.is_rest_day ? "bg-muted/30" : "bg-card hover:border-ink"}`}>
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className="font-serif text-3xl font-black w-12 shrink-0 text-saffron">{String(d.day_number).padStart(2, "0")}</div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-xl font-semibold truncate">{d.title}</h3>
                    {d.description && <p className="text-sm text-muted-foreground line-clamp-1">{d.description}</p>}
                    {d.duration_minutes && <span className="text-[11px] font-mono text-muted-foreground inline-flex items-center gap-1 mt-1"><Clock className="h-3 w-3" /> {d.duration_minutes}m</span>}
                  </div>
                </div>
                {!d.is_rest_day && (
                  <div className="flex gap-2 shrink-0">
                    {d.video_url && <a href={d.video_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs uppercase tracking-wider px-3 py-2 border border-ink/20 hover:bg-ink/5"><Play className="h-3 w-3" /> Video</a>}
                    <button onClick={() => logDay(d.id)} className="text-xs uppercase tracking-wider px-3 py-2 bg-ink text-ink-foreground hover:bg-saffron">Done</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
