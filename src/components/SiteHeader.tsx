import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export function SiteHeader() {
  const cls =
    "text-sm text-muted-foreground hover:text-foreground transition-colors";
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="/" className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold">
            Sportabilia<span className="text-primary">.hu</span>
          </span>
        </a>
        <nav className="flex gap-5">
          <Link
            to="/"
            className={cls}
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact: true }}
          >
            Keresés
          </Link>
          <Link
            to="/idopontfoglalas"
            className={cls}
            activeProps={{ className: "text-primary" }}
          >
            Időpontfoglalás
          </Link>
          <Link
            to="/admin"
            className={cls}
            activeProps={{ className: "text-primary" }}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
