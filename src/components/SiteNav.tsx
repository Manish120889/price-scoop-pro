import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Search, LogOut, User as UserIcon, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/", label: "Home" },
  { to: "/today", label: "Today" },
  { to: "/programs", label: "Programs" },
  { to: "/recipes", label: "Recipes" },
  { to: "/tracker", label: "Tracker" },
];

export const SiteNav = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-ink/15 bg-cream/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl font-black tracking-tight">Fatey</span>
          <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground hidden sm:inline">Fitness Champion</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-3 py-1.5 transition-colors relative ${isActive ? "text-ink" : "text-muted-foreground hover:text-ink"} ${isActive ? "after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:bg-saffron after:content-['']" : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `px-3 py-1.5 flex items-center gap-1 ${isActive ? "text-saffron" : "text-muted-foreground hover:text-saffron"}`}>
              <Shield className="h-3 w-3" /> Admin
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-ink/5 transition" aria-label="Search"><Search className="h-4 w-4" /></button>
          {user ? (
            <>
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground"><UserIcon className="h-3 w-3" /> {user.email?.split("@")[0]}</span>
              <button onClick={signOut} className="inline-flex items-center gap-1 text-xs uppercase tracking-wider px-3 py-2 hover:bg-ink/5">
                <LogOut className="h-3 w-3" /> Sign out
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/auth")} className="hidden md:inline-flex bg-ink text-ink-foreground text-xs tracking-wider uppercase font-semibold px-4 py-2.5 hover:bg-saffron transition">
              Join the cohort
            </button>
          )}
          <button className="lg:hidden p-2" aria-label="Menu"><Menu className="h-5 w-5" /></button>
        </div>
      </div>
    </header>
  );
};
