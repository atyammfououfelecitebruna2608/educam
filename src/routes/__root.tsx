import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import "../styles.css";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette page n'existe pas.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PensionVerify — Vérification des paiements de pension" },
      { name: "description", content: "Vérification par reconnaissance faciale et scan QR des reçus de paiement de pension étudiante." },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
        <style>{`
          :root {
            --radius: 1rem;
            --background: oklch(0.98 0.01 160);
            --foreground: oklch(0.15 0.05 160);
            --card: oklch(1 0 0);
            --card-foreground: oklch(0.15 0.05 160);
            --primary: oklch(0.35 0.12 165);
            --primary-foreground: oklch(0.98 0.01 160);
            --primary-glow: oklch(0.55 0.15 170);
            --secondary: oklch(0.94 0.03 165);
            --secondary-foreground: oklch(0.2 0.08 170);
            --accent: oklch(0.82 0.12 85);
            --accent-foreground: oklch(0.25 0.08 80);
            --border: oklch(0.88 0.03 160);
            --input: oklch(0.9 0.02 160);
            --ring: oklch(0.35 0.12 165);
          }
          .dark {
            --background: oklch(0.1 0.02 165);
            --foreground: oklch(0.98 0.01 160);
            --card: oklch(0.14 0.03 165);
            --card-foreground: oklch(0.98 0.01 160);
            --primary: oklch(0.72 0.14 160);
            --primary-foreground: oklch(0.1 0.02 165);
            --accent: oklch(0.85 0.12 90);
            --accent-foreground: oklch(0.1 0.02 90);
            --border: oklch(0.2 0.04 165);
          }
        `}</style>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}
