import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<"recipe" | "program" | "day" | "promote">("recipe");
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    if (isAdmin) supabase.from("programs").select("id,title").then(({ data }) => setPrograms(data ?? []));
  }, [isAdmin]);

  if (loading) return <div className="min-h-screen bg-background"><SiteNav /></div>;
  if (!user) return <Navigate to="/auth" />;
  if (!isAdmin) return (
    <div className="min-h-screen bg-background text-foreground grain">
      <SiteNav />
      <div className="max-w-md mx-auto p-12 text-center">
        <h1 className="font-serif text-4xl font-black">Admin only</h1>
        <p className="mt-3 text-muted-foreground">Your account does not have admin privileges. Use the "Make me admin" tab once a temp owner-bootstrap has been used, or ask another admin.</p>
        <PromoteSelf />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground grain">
      <SiteNav />
      <section className="max-w-[1100px] mx-auto px-6 py-10">
        <h1 className="font-serif text-4xl font-black">Content admin</h1>
        <p className="mt-2 text-muted-foreground">Paste content generated from Claude / Copilot / Canva. Hero images can be any public image URL.</p>
        <div className="mt-6 flex flex-wrap gap-2 border-b border-ink/15">
          {[
            ["recipe", "+ Recipe"],
            ["program", "+ Program"],
            ["day", "+ Program day"],
          ].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k as any)} className={`px-4 py-2 text-sm uppercase tracking-wider ${tab === k ? "border-b-2 border-saffron text-ink" : "text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
        <div className="mt-8">
          {tab === "recipe" && <RecipeForm />}
          {tab === "program" && <ProgramForm onCreated={() => supabase.from("programs").select("id,title").then(({ data }) => setPrograms(data ?? []))} />}
          {tab === "day" && <DayForm programs={programs} />}
        </div>
      </section>
    </div>
  );
}

function PromoteSelf() {
  const { user } = useAuth();
  const promote = async () => {
    if (!user) return;
    const { count } = await supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin");
    if ((count ?? 0) > 0) { toast.error("An admin already exists. Ask them to grant you access."); return; }
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: "admin" });
    if (error) toast.error(error.message);
    else { toast.success("You are now admin. Refresh."); setTimeout(() => location.reload(), 800); }
  };
  return <button onClick={promote} className="mt-6 bg-ink text-ink-foreground px-5 py-3 text-sm uppercase tracking-wider font-semibold hover:bg-saffron">Make me first admin</button>;
}

function RecipeForm() {
  const [f, setF] = useState({ title: "", description: "", hero_image: "", category: "mains", prep_minutes: 0, cook_minutes: 0, servings: 1, calories: 0, protein_g: 0, carbs_g: 0, fats_g: 0, difficulty: "easy", ingredients: "", instructions: "" });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...f, slug: slugify(f.title),
      ingredients: f.ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
      instructions: f.instructions.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    const { error } = await supabase.from("recipes").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Recipe published"); setF({ ...f, title: "", description: "", hero_image: "", ingredients: "", instructions: "" }); }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <Input label="Title" value={f.title} onChange={(v) => setF({ ...f, title: v })} required />
      <Text label="Description" value={f.description} onChange={(v) => setF({ ...f, description: v })} />
      <Input label="Hero image URL" value={f.hero_image} onChange={(v) => setF({ ...f, hero_image: v })} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Select label="Category" value={f.category} onChange={(v) => setF({ ...f, category: v })} options={["breakfast", "mains", "snacks", "drinks", "desserts"]} />
        <Select label="Difficulty" value={f.difficulty} onChange={(v) => setF({ ...f, difficulty: v })} options={["easy", "medium", "hard"]} />
        <Num label="Servings" value={f.servings} onChange={(v) => setF({ ...f, servings: v })} />
        <Num label="Calories" value={f.calories} onChange={(v) => setF({ ...f, calories: v })} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Num label="Prep min" value={f.prep_minutes} onChange={(v) => setF({ ...f, prep_minutes: v })} />
        <Num label="Cook min" value={f.cook_minutes} onChange={(v) => setF({ ...f, cook_minutes: v })} />
        <Num label="Protein g" value={f.protein_g} onChange={(v) => setF({ ...f, protein_g: v })} />
        <Num label="Carbs g" value={f.carbs_g} onChange={(v) => setF({ ...f, carbs_g: v })} />
      </div>
      <Num label="Fats g" value={f.fats_g} onChange={(v) => setF({ ...f, fats_g: v })} />
      <Text label="Ingredients (one per line)" value={f.ingredients} onChange={(v) => setF({ ...f, ingredients: v })} rows={8} />
      <Text label="Instructions (one step per line)" value={f.instructions} onChange={(v) => setF({ ...f, instructions: v })} rows={8} />
      <button className="bg-ink text-ink-foreground px-5 py-3 text-sm uppercase tracking-wider font-semibold hover:bg-saffron">Publish recipe</button>
    </form>
  );
}

function ProgramForm({ onCreated }: { onCreated: () => void }) {
  const [f, setF] = useState({ title: "", description: "", hero_image: "", duration_weeks: 2, level: "beginner", category: "full-body" });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("programs").insert({ ...f, slug: slugify(f.title) });
    if (error) toast.error(error.message);
    else { toast.success("Program created"); setF({ ...f, title: "", description: "", hero_image: "" }); onCreated(); }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <Input label="Title" value={f.title} onChange={(v) => setF({ ...f, title: v })} required />
      <Text label="Description" value={f.description} onChange={(v) => setF({ ...f, description: v })} />
      <Input label="Hero image URL" value={f.hero_image} onChange={(v) => setF({ ...f, hero_image: v })} />
      <div className="grid grid-cols-3 gap-3">
        <Num label="Weeks" value={f.duration_weeks} onChange={(v) => setF({ ...f, duration_weeks: v })} />
        <Select label="Level" value={f.level} onChange={(v) => setF({ ...f, level: v })} options={["beginner", "intermediate", "advanced"]} />
        <Select label="Category" value={f.category} onChange={(v) => setF({ ...f, category: v })} options={["full-body", "abs", "hiit", "strength", "mobility"]} />
      </div>
      <button className="bg-ink text-ink-foreground px-5 py-3 text-sm uppercase tracking-wider font-semibold hover:bg-saffron">Create program</button>
    </form>
  );
}

function DayForm({ programs }: { programs: any[] }) {
  const [f, setF] = useState({ program_id: "", day_number: 1, title: "", description: "", duration_minutes: 30, video_url: "", is_rest_day: false });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.program_id) { toast.error("Pick a program"); return; }
    const { error } = await supabase.from("program_days").insert(f);
    if (error) toast.error(error.message);
    else { toast.success("Day added"); setF({ ...f, title: "", description: "", video_url: "", day_number: f.day_number + 1 }); }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">Program</label>
        <select value={f.program_id} onChange={(e) => setF({ ...f, program_id: e.target.value })} className="mt-1 w-full border border-ink/20 px-3 py-2 bg-background text-sm">
          <option value="">— pick —</option>
          {programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Num label="Day #" value={f.day_number} onChange={(v) => setF({ ...f, day_number: v })} />
        <Num label="Duration min" value={f.duration_minutes} onChange={(v) => setF({ ...f, duration_minutes: v })} />
        <label className="flex items-end gap-2 text-sm"><input type="checkbox" checked={f.is_rest_day} onChange={(e) => setF({ ...f, is_rest_day: e.target.checked })} /> Rest day</label>
      </div>
      <Input label="Title" value={f.title} onChange={(v) => setF({ ...f, title: v })} required />
      <Text label="Description" value={f.description} onChange={(v) => setF({ ...f, description: v })} />
      <Input label="Video URL (YouTube embed/watch)" value={f.video_url} onChange={(v) => setF({ ...f, video_url: v })} />
      <button className="bg-ink text-ink-foreground px-5 py-3 text-sm uppercase tracking-wider font-semibold hover:bg-saffron">Add day</button>
    </form>
  );
}

const Input = ({ label, value, onChange, required }: any) => (
  <div><label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
    <input value={value} onChange={(e) => onChange(e.target.value)} required={required} className="mt-1 w-full border border-ink/20 px-3 py-2 bg-background text-sm" /></div>
);
const Text = ({ label, value, onChange, rows = 3 }: any) => (
  <div><label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="mt-1 w-full border border-ink/20 px-3 py-2 bg-background text-sm font-mono" /></div>
);
const Num = ({ label, value, onChange }: any) => (
  <div><label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
    <input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value) || 0)} className="mt-1 w-full border border-ink/20 px-3 py-2 bg-background text-sm" /></div>
);
const Select = ({ label, value, onChange, options }: any) => (
  <div><label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full border border-ink/20 px-3 py-2 bg-background text-sm">
      {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
    </select></div>
);
