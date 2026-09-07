import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Database, LogOut, ShieldCheck } from "lucide-react";

export default function AdminDashboardMain() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex items-center justify-between px-4 py-4">
          <div>
            <p className="overline text-primary">LEGACY ADMIN ENTRY</p>
            <h1 className="mt-1 text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Administration</h1>
            <p className="mt-1 text-sm text-muted-foreground">Welcome, {user?.name || "Administrator"}</p>
          </div>
          <Button onClick={() => logout()} variant="outline" className="flex items-center gap-2">
            <LogOut size={18} />
            Sign out
          </Button>
        </div>
      </header>

      <main className="container max-w-4xl px-4 py-16">
        <Card className="luxury-panel overflow-hidden border-primary/25 p-0">
          <div className="border-b border-primary/15 bg-card/70 p-8 md:p-10">
            <ShieldCheck className="h-9 w-9 text-primary" aria-hidden="true" />
            <h2 className="section-heading mt-6 text-4xl leading-tight">Verified reporting belongs in the active workspace.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              This legacy route no longer displays placeholder traffic charts, visitor figures, or collection counts. Use the active MVP workspace for database-backed operational management and current reporting.
            </p>
          </div>
          <div className="grid gap-4 p-8 md:grid-cols-2 md:p-10">
            <a href="/admin/dashboard-mvp" className="group rounded-xl border border-primary/30 bg-background p-6 transition-colors hover:bg-primary/10">
              <Database className="h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="mt-5 text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Open active workspace</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Manage current watch, subscriber, and import records through the live administrative dashboard.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </a>
            <a href="/" className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
              <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="mt-5 text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Return to the archive</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Review the public, source-bounded horology archive and its current editorial records.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">View archive <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </a>
          </div>
        </Card>
      </main>
    </div>
  );
}
