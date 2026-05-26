import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Heart, Clock, Flame } from "lucide-react";

export default function RecipeDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [r, setR] = useState<any>(null);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("recipes").select("*").eq("slug", slug!).maybeSingle();
      if (!data) return;
      setR(data);
      if (user) {
        const { data: f } = await supabase.from("favorites").select("id").eq("user_id", user.id).eq("item_type", "recipe").eq("item_id", data.id).maybeSingle();
        setFav(!!f);
      }
    })();
  }, [slug, user]);

  const toggleFav = async () => {
    if (!user) { toast.error("Sign in to save favorites"); return; }
    if (fav) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("item_type", "recipe").eq("item_id", r.id);
      setFav(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, item_type: "recipe", item_id: r.id });
      setFav(true);
    }
  };

  if (!r) return <div className="min-h-screen bg-background"><SiteNav /><div className="p-12 text-center text-muted-foreground">Loading…</div></div>;

  const ingredients: string[] = Array.isArray(r.ingredients) ? r.ingredients : [];
  const instructions: string[] = Array.isArray(r.instructions) ? r.instructions : [];
  const totalTime = (r.prep_minutes ?? 0) + (r.cook_minutes ?? 0);

  return (
    <div className="min-h-screen bg-background text-foreground grain">
      <SiteNav />
      <section className="border-b border-ink/15 grid lg:grid-cols-2">
        <div className="p-10 lg:p-16">
          <Link to="/recipes" className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-saffron">← All recipes</Link>
          <div className="mt-4 text-[10px] tracking-[0.25em] uppercase text-saffron">{r.category}</div>
          <h1 className="mt-4 font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] font-black leading-[0.95]">{r.title}</h1>
          {r.description && <p className="mt-4 text-lg text-ink/70 leading-relaxed">{r.description}</p>}
          <div className="mt-8 grid grid-cols-4 gap-4 border-y border-ink/15 py-5">
            <div><div className="font-serif text-2xl font-bold">{r.calories ?? "—"}</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">kcal</div></div>
            <div><div className="font-serif text-2xl font-bold">{r.protein_g ?? 0}g</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Protein</div></div>
            <div><div className="font-serif text-2xl font-bold">{r.carbs_g ?? 0}g</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Carbs</div></div>
            <div><div className="font-serif text-2xl font-bold">{r.fats_g ?? 0}g</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Fats</div></div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {totalTime || "—"} min</span>
            <span className="inline-flex items-center gap-1"><Flame className="h-4 w-4" /> {r.difficulty}</span>
            <span>Serves {r.servings ?? 1}</span>
          </div>
          <button onClick={toggleFav} className={`mt-6 inline-flex items-center gap-2 px-5 py-3 text-sm uppercase tracking-wider font-semibold border ${fav ? "bg-saffron text-ink border-saffron" : "border-ink/20 hover:bg-ink/5"}`}>
            <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} /> {fav ? "Saved" : "Save recipe"}
          </button>
        </div>
        <div className="bg-[hsl(36_60%_88%)] aspect-[4/3] lg:aspect-auto overflow-hidden">
          {r.hero_image ? <img src={r.hero_image} alt={r.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10rem]">🍽️</div>}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <h2 className="font-serif text-3xl font-bold border-b border-ink/15 pb-3">Ingredients</h2>
          <ul className="mt-5 space-y-3">
            {ingredients.map((ing, i) => (
              <li key={i} className="flex gap-3 text-sm"><span className="text-saffron font-mono shrink-0">{String(i + 1).padStart(2, "0")}</span><span>{ing}</span></li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <h2 className="font-serif text-3xl font-bold border-b border-ink/15 pb-3">Instructions</h2>
          <ol className="mt-5 space-y-5">
            {instructions.map((step, i) => (
              <li key={i} className="flex gap-5"><span className="font-serif text-4xl font-black text-saffron leading-none w-10 shrink-0">{i + 1}</span><p className="text-base leading-relaxed pt-1">{step}</p></li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
