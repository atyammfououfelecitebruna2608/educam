import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ScanLine, Users, LayoutDashboard, LogOut, ShieldCheck, Receipt, Menu, X } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary/20">
      <div className="md:hidden fixed inset-x-0 top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-input bg-card/80 text-foreground shadow-sm hover:bg-primary/10 transition"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-premium">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg tracking-tight text-gradient">PensionVerify</div>
              <div className="text-[11px] font-medium text-muted-foreground/80 uppercase tracking-[0.2em]">
                RECTORAT FS Ebolowa
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="h-11 px-3"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="text-xs font-bold">Déconnexion</span>
          </Button>
        </div>
      </div>

      <aside className="hidden md:flex w-72 glass border-r flex-col z-20">
        <div className="px-8 py-10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-premium animate-pulse-slow">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight text-gradient">PensionVerify</div>
              <div className="text-xs font-medium text-muted-foreground/80 uppercase tracking-widest">RECTORAT FS Ebolowa</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <div className="px-4 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Menu Principal</div>
          <NavItem to="/" icon={<LayoutDashboard className="h-5 w-5" />} label="Tableau de bord" />
          <NavItem to="/verify" icon={<ScanLine className="h-5 w-5" />} label="Scanner Reçu" />
          <NavItem to="/face-verify" icon={<ShieldCheck className="h-5 w-5" />} label="Vérifier Visage" />
          <NavItem to="/students" icon={<Users className="h-5 w-5" />} label="Base Étudiants" />
          <NavItem to="/depenses" icon={<Receipt className="h-5 w-5" />} label="Flux Dépenses" />
        </nav>

        <div className="p-6 mt-auto">
          <div className="glass-card p-4 space-y-4">
            <div className="flex items-center gap-3 px-1">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center border border-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-semibold truncate">{user?.email?.split('@')[0]}</div>
                <div className="text-[10px] text-muted-foreground truncate uppercase">{user?.email?.split('@')[1]}</div>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="text-xs font-bold">Déconnexion</span>
            </Button>
          </div>
        </div>
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileNavOpen(false)} />
          <aside className="relative h-full w-[min(92vw,320px)] overflow-y-auto bg-background/95 glass border-r border-border p-4 shadow-2xl backdrop-blur-lg">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-premium">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-base tracking-tight text-gradient">PensionVerify</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">RECTORAT FS Ebolowa</div>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-input text-foreground hover:bg-secondary/10 transition"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-2">
              <div className="px-3 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Menu Principal</div>
              <NavItem to="/" icon={<LayoutDashboard className="h-5 w-5" />} label="Tableau de bord" />
              <NavItem to="/verify" icon={<ScanLine className="h-5 w-5" />} label="Scanner Reçu" />
              <NavItem to="/face-verify" icon={<ShieldCheck className="h-5 w-5" />} label="Vérifier Visage" />
              <NavItem to="/students" icon={<Users className="h-5 w-5" />} label="Base Étudiants" />
              <NavItem to="/depenses" icon={<Receipt className="h-5 w-5" />} label="Flux Dépenses" />
            </nav>

            <div className="mt-6">
              <div className="glass-card p-4 space-y-4 rounded-3xl">
                <div className="flex items-center gap-3 px-1">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center border border-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-xs font-semibold truncate">{user?.email?.split('@')[0]}</div>
                    <div className="text-[10px] text-muted-foreground truncate uppercase">{user?.email?.split('@')[1]}</div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="text-xs font-bold">Déconnexion</span>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <main className="flex-1 relative overflow-hidden pt-16 md:pt-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] -z-10" />
        
        <div className="h-full overflow-auto">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-300 hover-lift group"
      activeProps={{
        className:
          "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold bg-primary/10 text-primary shadow-sm border border-primary/20",
      }}
    >
      <span className="transition-transform duration-300 group-hover:scale-110">{icon}</span>
      {label}
    </Link>
  );
}
