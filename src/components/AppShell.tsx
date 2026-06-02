import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ScanLine, Users, LayoutDashboard, LogOut, ShieldCheck, Receipt } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex bg-background font-sans selection:bg-primary/20">
      <aside className="w-72 glass border-r flex flex-col z-20">
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

      <main className="flex-1 relative overflow-hidden">
        {/* Subtle background glow elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] -z-10" />
        
        <div className="h-full overflow-auto">
          <div className="max-w-6xl mx-auto p-8 lg:p-12 animate-in fade-in duration-700">
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
