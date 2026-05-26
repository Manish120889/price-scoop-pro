import { ArrowUpRight, Clock, Flame, Leaf } from "lucide-react";
import heroImg from "@/assets/recipes-hero.jpg";
import { SiteNav } from "@/components/SiteNav";

type Recipe = {
  id: string;
  name: string;
  emoji: string;
  cal: number;
  time: number;
  p: number;
  c: number;
  f: number;
  tag: string;
  tint: string; // tailwind bg class
};

const sections: { id: string; kicker: string; title: string; blurb: string; items: Recipe[] }[] = [
  {
    id: "breakfast",
    kicker: "Chapter 01",
    title: "Breakfast",
    blurb: "Slow mornings, fast macros. Start the day fuelled — never heavy.",
    items: [
      { id: "b1", name: "Protein Pancakes", emoji: "🥞", cal: 350, time: 15, p: 25, c: 35, f: 8, tag: "Power stack", tint: "bg-[hsl(36_85%_88%)]" },
      { id: "b2", name: "Egg White Omelette", emoji: "🥚", cal: 220, time: 10, p: 28, c: 5, f: 6, tag: "Lean & light", tint: "bg-[hsl(150_30%_85%)]" },
      { id: "b3", name: "High-Protein Oatmeal", emoji: "🥣", cal: 380, time: 12, p: 22, c: 48, f: 7, tag: "Slow burn", tint: "bg-[hsl(20_55%_85%)]" },
    ],
  },
  {
    id: "mains",
    kicker: "Chapter 02",
    title: "Lunch & Dinner",
    blurb: "Punjabi roots, athlete's plate. Bold spice. Honest protein.",
    items: [
      { id: "m1", name: "Tandoori Chicken", emoji: "🍗", cal: 420, time: 35, p: 45, c: 15, f: 12, tag: "Coal-fired", tint: "bg-[hsl(8_70%_82%)]" },
      { id: "m2", name: "Dal & Brown Rice", emoji: "🍲", cal: 480, time: 45, p: 18, c: 65, f: 8, tag: "Homestyle", tint: "bg-[hsl(36_70%_82%)]" },
      { id: "m3", name: "Salmon with Veggies", emoji: "🐟", cal: 420, time: 30, p: 35, c: 28, f: 15, tag: "Omega rich", tint: "bg-[hsl(190_35%_82%)]" },
    ],
  },
  {
    id: "snacks",
    kicker: "Chapter 03",
    title: "Snacks & Shakes",
    blurb: "The in-between matters. Hit macros without breaking flow.",
    items: [
      { id: "s1", name: "Protein Smoothie", emoji: "🥤", cal: 280, time: 5, p: 30, c: 32, f: 4, tag: "Post-lift", tint: "bg-[hsl(330_40%_88%)]" },
      { id: "s2", name: "Peanut Butter Toast", emoji: "🥜", cal: 320, time: 5, p: 14, c: 32, f: 14, tag: "Quick fix", tint: "bg-[hsl(30_45%_82%)]" },
      { id: "s3", name: "Greek Yogurt Parfait", emoji: "🍎", cal: 250, time: 5, p: 20, c: 28, f: 5, tag: "Crunch & cool", tint: "bg-[hsl(45_70%_86%)]" },
    ],
  },
];

const macros = [
  { pct: 30, label: "Protein", note: "Muscle, recovery, satiety", icon: Flame, color: "text-saffron" },
  { pct: 40, label: "Carbs", note: "Training fuel, mental clarity", icon: Leaf, color: "text-mint" },
  { pct: 30, label: "Healthy Fats", note: "Hormones, joints, focus", icon: Leaf, color: "text-turmeric" },
];



const RecipeCard = ({ r, i }: { r: Recipe; i: number }) => (
  <article
    className="group relative border border-ink/15 bg-card hover:border-ink transition-colors duration-300 animate-[fadeUp_0.7s_cubic-bezier(.16,1,.3,1)_both]"
    style={{ animationDelay: `${i * 80}ms` }}
  >
    <div className={`relative ${r.tint} aspect-[4/3] flex items-center justify-center overflow-hidden`}>
      <span className="text-[7rem] leading-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3 drop-shadow-sm">
        {r.emoji}
      </span>
      <span className="absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase font-semibold bg-ink text-ink-foreground px-2 py-1">
        {r.tag}
      </span>
      <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] tracking-wide font-mono bg-cream/90 backdrop-blur px-2 py-1 text-ink">
        <Clock className="h-3 w-3" /> {r.time}m
      </span>
    </div>
    <div className="p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-2xl font-semibold leading-tight">{r.name}</h3>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/40 group-hover:text-saffron group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
      </div>
      <div className="mt-4 flex items-end justify-between border-t border-ink/10 pt-3">
        <div>
          <div className="font-serif text-3xl font-bold tabular-nums">{r.cal}</div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">kcal · per serving</div>
        </div>
        <div className="flex gap-3 text-[11px] font-mono">
          <span><span className="text-muted-foreground">P</span> <strong className="text-ink">{r.p}g</strong></span>
          <span><span className="text-muted-foreground">C</span> <strong className="text-ink">{r.c}g</strong></span>
          <span><span className="text-muted-foreground">F</span> <strong className="text-ink">{r.f}g</strong></span>
        </div>
      </div>
    </div>
  </article>
);

const Index = () => {
  const [active, setActive] = useState("Recipes");

  return (
    <div className="min-h-screen bg-background text-foreground grain">
      {/* ─── Top bar ─── */}
      <header className="border-b border-ink/15 bg-cream/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between gap-6">
          <a href="#" className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-black tracking-tight">Fatey</span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Fitness Champion</span>
          </a>
          <nav className="hidden lg:flex items-center gap-1 text-sm">
            {nav.map((n) => (
              <button
                key={n}
                onClick={() => setActive(n)}
                className={`px-3 py-1.5 transition-colors relative ${
                  active === n ? "text-ink" : "text-muted-foreground hover:text-ink"
                }`}
              >
                {n}
                {active === n && <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-saffron" />}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-ink/5 transition" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
            <button className="hidden md:inline-flex bg-ink text-ink-foreground text-xs tracking-wider uppercase font-semibold px-4 py-2.5 hover:bg-saffron transition">
              Join the cohort
            </button>
            <button className="lg:hidden p-2" aria-label="Menu"><Menu className="h-5 w-5" /></button>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative border-b border-ink/15 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-12 gap-8 py-10 lg:py-16">
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              <span className="h-px w-8 bg-ink/30" /> Vol. 04 · Recipes & Nutrition
            </div>
            <div className="mt-8 lg:mt-12">
              <h1 className="font-serif text-[clamp(3rem,7vw,6.5rem)] font-black leading-[0.92] tracking-[-0.04em]">
                Eat like an
                <br />
                <span className="italic font-light">athlete.</span>
                <br />
                Cook like a
                <br />
                <span className="text-saffron">Punjabi.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg text-ink/70 leading-relaxed">
                Nine performance recipes rooted in Indian kitchens — engineered for macros, made for real life.
                No protein-powder cheating, no boring chicken-and-rice.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#breakfast" className="group inline-flex items-center gap-2 bg-ink text-ink-foreground px-5 py-3 text-sm tracking-wider uppercase font-semibold hover:bg-saffron transition">
                  Browse recipes
                  <ArrowUpRight className="h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <a href="#guidelines" className="text-sm underline decoration-saffron decoration-2 underline-offset-4 hover:text-saffron">
                  Read the nutrition manifesto →
                </a>
              </div>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs font-mono text-muted-foreground">
              <span><strong className="text-ink text-base font-serif">9</strong> recipes</span>
              <span className="h-3 w-px bg-ink/20" />
              <span><strong className="text-ink text-base font-serif">30%</strong> avg protein</span>
              <span className="h-3 w-px bg-ink/20" />
              <span><strong className="text-ink text-base font-serif">5—45</strong> min</span>
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden border border-ink/20">
              <img
                src={heroImg}
                alt="Overhead spread of Punjabi healthy meal — tandoori chicken, dal, brown rice in copper bowls with herbs and spices"
                className="w-full h-full object-cover"
                width={1600}
                height={1100}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-turmeric px-4 py-3 rotate-[-3deg] shadow-lg hidden md:block">
              <div className="font-serif text-xs italic">"Spice is medicine."</div>
              <div className="text-[10px] tracking-[0.2em] uppercase mt-0.5">— Fatey kitchen rule #1</div>
            </div>
            <div className="absolute -top-3 -right-3 bg-cream border border-ink px-3 py-2 hidden md:block">
              <div className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground">Updated</div>
              <div className="font-mono text-xs">May 2026</div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-t border-ink/15 bg-ink text-ink-foreground overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-3 font-serif text-xl italic">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex shrink-0 items-center gap-8 pr-8">
                {["Tandoori", "Turmeric", "Ghee (wisely)", "Brown basmati", "Paneer", "Methi", "Cardamom", "Coriander", "Mustard oil", "Black pepper"].map((w) => (
                  <span key={w} className="flex items-center gap-8">
                    {w}
                    <span className="text-saffron">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Macro guidelines ─── */}
      <section id="guidelines" className="border-b border-ink/15 py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-8 mb-10">
            <div className="lg:col-span-5">
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">§ The Plate Equation</p>
              <h2 className="font-serif text-5xl lg:text-6xl font-black leading-none">
                Daily nutrition,<br />
                <span className="italic font-light text-saffron">distilled</span>.
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex items-end">
              <p className="text-ink/70 text-lg leading-relaxed">
                Three macros. One simple ratio. Built for the body that lifts heavy, walks 10k steps, and still wants
                a second helping of dal makhani on Sunday.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-ink/15 border border-ink/15">
            {macros.map((m, i) => (
              <div key={m.label} className="bg-cream p-8 lg:p-10 flex flex-col justify-between min-h-[280px] relative overflow-hidden group">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1} / 03</span>
                  <m.icon className={`h-5 w-5 ${m.color}`} />
                </div>
                <div>
                  <div className="font-serif text-[7rem] lg:text-[9rem] font-black leading-none tabular-nums tracking-[-0.05em]">
                    {m.pct}<span className="text-saffron">%</span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <h3 className="font-serif text-2xl font-semibold">{m.label}</h3>
                    <span className="text-xs text-muted-foreground max-w-[55%] text-right">{m.note}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Recipe sections ─── */}
      {sections.map((s, si) => (
        <section key={s.id} id={s.id} className={`py-16 lg:py-24 ${si % 2 === 1 ? "bg-cream" : ""} border-b border-ink/15`}>
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 pb-6 border-b border-ink ink-rule">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">{s.kicker}</p>
                <h2 className="font-serif text-5xl lg:text-7xl font-black leading-[0.95] tracking-tight">
                  {s.title}.
                </h2>
              </div>
              <p className="max-w-md text-ink/70 text-lg italic font-serif">{s.blurb}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {s.items.map((r, i) => <RecipeCard key={r.id} r={r} i={i} />)}
            </div>
          </div>
        </section>
      ))}

      {/* ─── CTA ─── */}
      <section className="bg-ink text-ink-foreground py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 grain opacity-30" />
        <div className="max-w-[1400px] mx-auto px-6 relative">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <p className="text-[10px] tracking-[0.25em] uppercase text-saffron mb-4">The Newsletter</p>
              <h2 className="font-serif text-5xl lg:text-7xl font-black leading-[0.95]">
                One recipe a week.<br />
                <span className="italic font-light">No noise.</span>
              </h2>
              <p className="mt-6 max-w-lg text-ink-foreground/70 text-lg">
                Macros, the back-story, and a short voice-note from the Fatey kitchen. Free. Forever.
              </p>
            </div>
            <form className="lg:col-span-4 flex flex-col justify-end gap-3" onSubmit={(e) => e.preventDefault()}>
              <label className="text-[10px] tracking-[0.25em] uppercase text-ink-foreground/60">Your email</label>
              <input
                type="email"
                placeholder="you@kitchen.com"
                className="bg-transparent border-b border-ink-foreground/40 focus:border-saffron outline-none py-3 text-lg placeholder:text-ink-foreground/30"
              />
              <button className="mt-4 bg-saffron text-ink px-6 py-4 text-sm tracking-wider uppercase font-bold hover:bg-turmeric transition flex items-center justify-center gap-2 group">
                Subscribe <ArrowUpRight className="h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-cream border-t border-ink/15">
        <div className="max-w-[1400px] mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="font-serif text-3xl font-black">Fatey<span className="text-saffron">.</span></div>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              A field journal of training, recipes, and recoveries — from a Punjabi kitchen to a champion's plate.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold mb-3 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Recipes", "Programs", "Journey", "Community"].map((l) => (
                <li key={l}><a href="#" className="hover:text-saffron">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold mb-3 uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Instagram", "YouTube", "Newsletter", "Contact"].map((l) => (
                <li key={l}><a href="#" className="hover:text-saffron">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-ink/15">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>© 2026 Fatey Fitness Champion. Cooked with ghee & discipline.</span>
            <span className="font-mono">v04 · Recipes & Nutrition</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
