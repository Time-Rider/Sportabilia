import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useState, lazy, Suspense } from "react";
import {
  Search,
  QrCode,
  ShieldCheck,
  Lock,
  CalendarCheck,
  FileText,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { itemStore, useItems, type Item } from "@/items";

const QrScanner = lazy(() =>
  import("@/components/QrScanner").then((m) => ({ default: m.QrScanner })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sportabilia.hu – Sportemléktárgyak hiteles tanúsítása" },
      {
        name: "description",
        content:
          "Ellenőrizze sportrelikviája eredetiségét leltári szám vagy QR-kód alapján.",
      },
      {
        property: "og:title",
        content: "Sportabilia.hu – Hiteles sportemléktárgyak",
      },
      {
        property: "og:description",
        content:
          "Tanúsított sportrelikviák keresése leltári szám vagy QR-kód alapján.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const all = useItems();
  const [q, setQ] = useState("");
  const [result, setResult] = useState<Item | null | undefined>(undefined);
  const [qrOpen, setQrOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  const search = (value: string) => {
    setQ(value);
    setResult(itemStore.find(value) ?? null);
  };
  const onQr = useCallback((text: string) => {
    setQrOpen(false);
    const m = text.match(/SPA-\d{4}-\d{6}/i);
    search(m ? m[0].toUpperCase() : text);
  }, []);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-primary)_0%,transparent_60%)] opacity-10" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">
            Professzionális hitelesítő központ
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Minden relikviának van története.
            <br />
            <span className="text-primary">Mi igazoljuk.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Ellenőrizze egy sportemléktárgy eredetiségét az egyedi leltári szám
            vagy a tanúsítványon található QR-kód alapján.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              search(q);
            }}
            className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Leltári szám, pl. SPA-2024-000187"
                className="h-12 pl-10 text-base"
              />
            </div>
            <Button type="submit" size="lg" className="h-12">
              Keresés
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="h-12"
              onClick={() => setQrOpen(true)}
            >
              <QrCode className="mr-2 h-5 w-5" />
              QR-kód
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            Próbálja ki:{" "}
            {all.slice(0, 3).map((i) => (
              <button
                key={i.id}
                onClick={() => search(i.id)}
                className="mx-1 underline decoration-dotted hover:text-primary"
              >
                {i.id}
              </button>
            ))}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        {result === null && (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="font-display text-xl">Nincs találat</p>
            <p className="mt-2 text-muted-foreground">
              A(z) „{q}” leltári számú tárgy nem szerepel nyilvántartásunkban.
            </p>
          </div>
        )}
        {result && (
          <ItemCard
            item={result}
            authed={authed}
            onMore={() => setLoginOpen(true)}
          />
        )}
        {result === undefined && <Features />}
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-4 py-12 md:flex-row">
          <div>
            <h2 className="text-2xl font-bold">
              Hitelesíttetné saját relikviáját?
            </h2>
            <p className="mt-1 text-muted-foreground">
              Foglaljon időpontot szakértőinkhez személyes vizsgálatra.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/idopontfoglalas">
              <CalendarCheck className="mr-2 h-5 w-5" />
              Időpontfoglalás
            </Link>
          </Button>
        </div>
      </section>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR-kód beolvasása</DialogTitle>
            <DialogDescription>
              Tartsa a tanúsítvány QR-kódját a kamera elé.
            </DialogDescription>
          </DialogHeader>
          {qrOpen && (
            <Suspense
              fallback={
                <p className="text-sm text-muted-foreground">
                  Kamera indítása…
                </p>
              }
            >
              <QrScanner onResult={onQr} />
            </Suspense>
          )}
        </DialogContent>
      </Dialog>

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSuccess={() => {
          setAuthed(true);
          setLoginOpen(false);
        }}
      />
    </main>
  );
}

function Features() {
  const f = [
    {
      icon: ShieldCheck,
      t: "Független szakértők",
      d: "Minősített hitelesítők, több évtizedes tapasztalattal.",
    },
    {
      icon: FileText,
      t: "Teljes dokumentáció",
      d: "Eredetigazolás, UV- és kézírásvizsgálat, fotódokumentáció.",
    },
    {
      icon: QrCode,
      t: "Azonnali ellenőrzés",
      d: "Minden tanúsítványhoz egyedi leltári szám és QR-kód tartozik.",
    },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {f.map(({ icon: I, t, d }) => (
        <div key={t} className="rounded-lg border border-border bg-card p-6">
          <I className="h-8 w-8 text-primary" />
          <h3 className="mt-4 text-lg font-bold">{t}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{d}</p>
        </div>
      ))}
    </div>
  );
}

function ItemCard({
  item,
  authed,
  onMore,
}: {
  item: Item;
  authed: boolean;
  onMore: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="grid gap-2 p-2 sm:grid-cols-2 lg:grid-cols-3">
        {item.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${item.name} – ${i + 1}. kép`}
            loading="lazy"
            width={1024}
            height={1024}
            className="aspect-square w-full rounded-md object-cover"
          />
        ))}
      </div>
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Hitelesített
          </span>
          <span className="font-mono text-sm text-muted-foreground">
            {item.id}
          </span>
        </div>
        <h2 className="mt-3 text-3xl font-bold">{item.name}</h2>
        <p className="mt-3 text-muted-foreground">{item.description}</p>
        <p className="mt-4 flex items-center gap-2 text-sm">
          <UserCheck className="h-4 w-4 text-primary" />
          Hitelesítette: <strong>{item.certifier}</strong>
        </p>

        {!authed ? (
          <button
            onClick={onMore}
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            <Lock className="h-4 w-4" />
            Részletes információk előfizetőknek
          </button>
        ) : (
          <div className="mt-8 grid gap-6 border-t border-border pt-6 md:grid-cols-2">
            <Detail label="Történet" value={item.history} wide />
            <Detail label="Tulajdonosi lánc" value={item.provenance} wide />
            <Detail label="Kategória" value={item.category} />
            <Detail label="Évszám" value={item.year} />
            <Detail label="Állapot" value={item.condition} />
            <Detail label="Hitelesítés dátuma" value={item.certifiedAt} />
            <Detail label="Becsült érték" value={item.estimatedValue} />
            <Detail
              label="Csatolmányok"
              value={item.attachments.join(", ") || "–"}
            />
          </div>
        )}
      </div>
    </article>
  );
}

function Detail({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <p className="text-xs uppercase tracking-widest text-primary">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}

function LoginDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSuccess: () => void;
}) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Előfizetői bejelentkezés</DialogTitle>
          <DialogDescription>
            A részletes adatok csak előfizetőink számára érhetők el.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!u.trim() || !p.trim())
              return setErr(
                "Kérjük, adja meg a felhasználónevet és a jelszót.",
              );
            setErr("");
            onSuccess();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="u">Felhasználónév</Label>
            <Input
              id="u"
              value={u}
              onChange={(e) => setU(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p">Jelszó</Label>
            <Input
              id="p"
              type="password"
              value={p}
              onChange={(e) => setP(e.target.value)}
              maxLength={100}
            />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button type="submit" className="w-full">
            Bejelentkezés
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
