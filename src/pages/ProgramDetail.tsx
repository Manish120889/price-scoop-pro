import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Heart, Play, Clock, CheckCircle2, Calendar, Dumbbell, Flame, ArrowLeft,
  Moon, ChevronRight, Users, Trophy,
} from "lucide-react";

type Program = {
  id: string; slug: string; title: string; description: string | null;
  hero_image: string | null; duration_weeks: number | null; level: string | null; category: string | null;
};
type Day = {
  id: string; day_number: number; title: string; description: string | null;
  duration_minutes: number | null; video_url: string | null; is_rest_day: boolean | null;
  exercises: any;
};

function ytId(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}

export default function ProgramDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [program, setProgram] = useState<Program | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [fav, setFav] = useState(false);
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeDay, setActiveDay] = useState<Day | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from("programs").select("*").eq("slug", slug!).maybeSingle();
      if (!p) return;
      setProgram(p as Program);
      const { data: d } = await supabase.from("program_days").select("*").eq("program_id", p.id).order("day_number");
      setDays((d ?? []) as Day[]);
      if (user) {
        const { data: f } = await supabase.from("favorites").select("id").eq("user_id", user.id).eq("item_type", "program").eq("item_id", p.id).maybeSingle();
        setFav(!!f);
        const { data: logs } = await supabase.from("progress_logs").select("program_day_id").eq("user_id", user.id).eq("workout_completed", true);
        setCompleted(new Set((logs ?? []).map((l: any) => l.program_day_id).filter(Boolean)));
      }
    })();
  }, [slug, user]);

  const weeks = useMemo(() => {
    const w = program?.duration_weeks ?? Math.max(1, Math.ceil(days.length / 7));
    return Array.from({ length: w }, (_, i) => i + 1);
  }, [program, days]);

  const daysByWeek = useMemo(() => {
    return weeks.map((w) => days.filter((d) => Math.ceil(d.day_number / 7) === w));
  }, [weeks, days]);

  const currentWeekDays = daysByWeek[activeWeek - 1] ?? [];

  useEffect(() => {
    if (!activeDay && currentWeekDays.length) setActiveDay(currentWeekDays.find((d) => !d.is_rest_day) ?? currentWeekDays[0]);
  }, [currentWeekDays, activeDay]);

  const toggleFav = async () => {
    if (!user || !program) { toast.error("Sign in to save favorites"); return; }
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
    setCompleted((s) => new Set([...s, dayId]));
    toast.success("Workout logged! 🎉");
  };

  if (!program) {
    return <div className="min-h-screen bg-light-bg"><SiteNav /><div className="p-12 text-center text-muted-foreground">Loading…</div></div>;
  }

  const totalDays = days.length;
  const doneInProgram = days.filter((d) => completed.has(d.id)).length;
  const progressPct = totalDays ? Math.round((doneInProgram / totalDays) * 100) : 0;
  const totalMinutes = days.reduce((s, d) => s + (d.duration_minutes ?? 0), 0);

  return (
    <div className="min-h-screen bg-light-bg text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="relative bg-sage text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {program.hero_image && <img src={program.hero_image} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-sage via-sage/90 to-sage/40" />
        <div className="relative max-w-[1400px] mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
          <div>
            <Link to="/programs" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-white/80 hover:text-white">
              <ArrowLeft className="h-3 w-3" /> All programs
            </Link>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="bg-earth text-white text-[10px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-full">{program.level}</span>
              <span className="bg-white/15 backdrop-blur text-[10px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-full">{program.category}</span>
              <span className="bg-white/15 backdrop-blur text-[10px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-full">{program.duration_weeks}-week program</span>
            </div>
            <h1 className="mt-5 font-serif text-[clamp(2.75rem,6vw,5rem)] font-black leading-[0.95] tracking-[-0.02em]">
              {program.title}
            </h1>
            {program.description && (
              <p className="mt-5 text-lg text-white/85 max-w-xl leading-relaxed">{program.description}</p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 bg-white text-sage px-6 py-3 text-sm uppercase tracking-wider font-bold hover:bg-light-bg transition rounded-full"
              >
                <Play className="h-4 w-4 fill-current" /> Start program
              </button>
              <button
                onClick={toggleFav}
                className={`inline-flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-wider font-bold rounded-full transition border-2 ${
                  fav ? "bg-earth border-earth text-white" : "border-white/50 text-white hover:bg-white/10"
                }`}
              >
                <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} /> {fav ? "Saved" : "Save"}
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <HeroStat icon={Calendar} label="Weeks" value={`${program.duration_weeks}`} />
              <HeroStat icon={Dumbbell} label="Workouts" value={`${days.filter((d) => !d.is_rest_day).length}`} />
              <HeroStat icon={Clock} label="Total time" value={`${Math.round(totalMinutes / 60)}h`} />
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="aspect-[4/5] bg-white/10 backdrop-blur rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              {program.hero_image ? (
                <img src={program.hero_image} alt={program.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10rem]">💪</div>
              )}
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white text-sage px-5 py-4 rounded-xl shadow-xl flex items-center gap-3">
              <Trophy className="h-8 w-8 text-earth" />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Community</div>
                <div className="font-serif text-lg font-black leading-none">12.4k completed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress strip (if signed in) */}
      {user && (
        <section className="bg-blue-green text-white">
          <div className="max-w-[1400px] mx-auto px-6 py-5 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4" /> Your progress
            </div>
            <div className="flex-1 min-w-[180px] h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-earth transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="font-mono text-sm tabular-nums">
              {doneInProgram}/{totalDays} days · {progressPct}%
            </div>
          </div>
        </section>
      )}

      {/* SCHEDULE */}
      <section id="schedule" className="max-w-[1400px] mx-auto px-6 py-14">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-sage font-bold">Weekly schedule</p>
            <h2 className="mt-2 font-serif text-4xl font-black">Your training plan</h2>
            <p className="mt-2 text-muted-foreground">Pick a week, follow each day. Rest days matter.</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <Users className="h-4 w-4 inline mr-1 text-sage" /> Free to follow · No equipment needed
          </div>
        </div>

        {/* Week tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
          {weeks.map((w) => {
            const isActive = w === activeWeek;
            const weekDays = daysByWeek[w - 1] ?? [];
            const weekDone = weekDays.filter((d) => completed.has(d.id)).length;
            return (
              <button
                key={w}
                onClick={() => { setActiveWeek(w); setActiveDay(null); }}
                className={`shrink-0 px-5 py-3 rounded-full text-sm font-bold transition border-2 ${
                  isActive
                    ? "bg-sage text-white border-sage shadow-md"
                    : "bg-white text-sage border-sage/30 hover:border-sage"
                }`}
              >
                Week {w}
                {weekDays.length > 0 && (
                  <span className={`ml-2 text-[10px] font-mono ${isActive ? "text-white/80" : "text-muted-foreground"}`}>
                    {weekDone}/{weekDays.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Day rail + detail */}
        <div className="mt-8 grid lg:grid-cols-[340px_1fr] gap-6">
          {/* Day list */}
          <div className="space-y-2">
            {currentWeekDays.length === 0 ? (
              <div className="bg-white border border-dashed border-sage/40 p-6 text-center text-muted-foreground rounded-xl">
                No days scheduled for this week yet.
              </div>
            ) : (
              currentWeekDays.map((d) => {
                const isActive = activeDay?.id === d.id;
                const done = completed.has(d.id);
                const dayInWeek = ((d.day_number - 1) % 7) + 1;
                return (
                  <button
                    key={d.id}
                    onClick={() => setActiveDay(d)}
                    className={`w-full text-left bg-white border-2 rounded-xl p-4 flex items-center gap-4 transition ${
                      isActive ? "border-sage shadow-md" : "border-transparent hover:border-sage/30"
                    }`}
                  >
                    <div
                      className={`shrink-0 w-12 h-12 rounded-full flex flex-col items-center justify-center font-bold ${
                        d.is_rest_day
                          ? "bg-light-bg text-blue-green"
                          : done
                          ? "bg-sage text-white"
                          : "bg-earth/20 text-earth"
                      }`}
                    >
                      {d.is_rest_day ? <Moon className="h-5 w-5" /> : done ? <CheckCircle2 className="h-5 w-5" /> : (
                        <>
                          <span className="text-[8px] uppercase tracking-wider leading-none">Day</span>
                          <span className="text-sm leading-none mt-0.5">{dayInWeek}</span>
                        </>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-base font-bold truncate">{d.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        {d.is_rest_day ? (
                          <span>Rest & recover</span>
                        ) : (
                          <>
                            {d.duration_minutes && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {d.duration_minutes} min</span>}
                            {Array.isArray(d.exercises) && d.exercises.length > 0 && (
                              <span className="flex items-center gap-1"><Dumbbell className="h-3 w-3" /> {d.exercises.length} moves</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition ${isActive ? "text-sage" : "text-muted-foreground"}`} />
                  </button>
                );
              })
            )}
          </div>

          {/* Active day detail */}
          <div>
            {activeDay ? (
              <DayDetail day={activeDay} done={completed.has(activeDay.id)} onLog={() => logDay(activeDay.id)} />
            ) : (
              <div className="bg-white border border-sage/20 rounded-xl p-12 text-center text-muted-foreground">
                Select a day to see the workout.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What you'll need */}
      <section className="bg-white border-t border-sage/20">
        <div className="max-w-[1400px] mx-auto px-6 py-14 grid md:grid-cols-3 gap-8">
          <InfoBlock icon={Flame} title="No equipment needed" body="Bodyweight only. All you need is a mat and a little floor space." />
          <InfoBlock icon={Clock} title="15–45 min per day" body="Short, focused sessions. Designed to fit a busy week." />
          <InfoBlock icon={Trophy} title="Real results" body="Stay consistent for the full program and feel the change." />
        </div>
      </section>
    </div>
  );
}

function HeroStat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/15">
      <Icon className="h-4 w-4 text-earth" />
      <div className="mt-2 font-serif text-2xl font-black leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-white/70 mt-1">{label}</div>
    </div>
  );
}

function InfoBlock({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <div className="bg-light-bg text-sage p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-serif text-xl font-bold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function DayDetail({ day, done, onLog }: { day: Day; done: boolean; onLog: () => void }) {
  const yt = ytId(day.video_url);
  const exercises: any[] = Array.isArray(day.exercises) ? day.exercises : [];

  if (day.is_rest_day) {
    return (
      <div className="bg-gradient-to-br from-blue-green to-sage text-white rounded-2xl p-10 lg:p-14 text-center">
        <Moon className="h-12 w-12 mx-auto opacity-80" />
        <h3 className="mt-4 font-serif text-4xl font-black">Rest day</h3>
        <p className="mt-3 text-white/85 max-w-md mx-auto">
          {day.description || "Your body grows on rest days. Hydrate, stretch, and sleep well."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-sage/20 rounded-2xl overflow-hidden">
      {/* Video / poster */}
      <div className="relative bg-black aspect-video">
        {yt ? (
          <iframe
            src={`https://www.youtube.com/embed/${yt}?rel=0`}
            title={day.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : day.video_url ? (
          <video src={day.video_url} controls className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sage to-blue-green flex items-center justify-center">
            <Play className="h-16 w-16 text-white/70" />
          </div>
        )}
      </div>

      <div className="p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-sage font-bold">Day {day.day_number}</div>
            <h3 className="mt-1 font-serif text-3xl font-black">{day.title}</h3>
            {day.description && <p className="mt-2 text-muted-foreground max-w-2xl">{day.description}</p>}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {day.duration_minutes && (
              <span className="bg-light-bg text-sage px-3 py-1.5 rounded-full font-semibold inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> {day.duration_minutes} min
              </span>
            )}
            {exercises.length > 0 && (
              <span className="bg-earth/15 text-earth px-3 py-1.5 rounded-full font-semibold inline-flex items-center gap-1">
                <Dumbbell className="h-3 w-3" /> {exercises.length} exercises
              </span>
            )}
          </div>
        </div>

        {/* Exercises */}
        {exercises.length > 0 && (
          <div className="mt-6">
            <h4 className="font-serif text-lg font-bold mb-3">Workout breakdown</h4>
            <ol className="divide-y divide-sage/15 border border-sage/15 rounded-xl overflow-hidden">
              {exercises.map((ex: any, i: number) => (
                <li key={i} className="flex items-center gap-4 p-4 hover:bg-light-bg transition">
                  <div className="w-8 h-8 rounded-full bg-sage text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{ex.name ?? ex.title ?? `Exercise ${i + 1}`}</div>
                    {ex.notes && <div className="text-xs text-muted-foreground mt-0.5">{ex.notes}</div>}
                  </div>
                  <div className="font-mono text-sm text-blue-green shrink-0">
                    {ex.reps ? `${ex.reps} reps` : ex.duration ? ex.duration : ex.sets ? `${ex.sets} sets` : ""}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            onClick={onLog}
            disabled={done}
            className={`inline-flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-wider font-bold rounded-full transition ${
              done
                ? "bg-sage/20 text-sage cursor-default"
                : "bg-sage text-white hover:bg-blue-green"
            }`}
          >
            <CheckCircle2 className={`h-4 w-4 ${done ? "fill-current" : ""}`} />
            {done ? "Completed" : "Mark as done"}
          </button>
          {day.video_url && (
            <a
              href={day.video_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-wider font-bold rounded-full border-2 border-sage/30 text-sage hover:bg-light-bg transition"
            >
              <Play className="h-4 w-4" /> Open video
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
