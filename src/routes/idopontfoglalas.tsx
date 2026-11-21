import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/idopontfoglalas")({
  head: () => ({
    meta: [
      { title: "Időpontfoglalás – Sportabilia.hu" },
      {
        name: "description",
        content:
          "Foglaljon időpontot sportemléktárgya szakértői hitelesítésére.",
      },
      { property: "og:title", content: "Időpontfoglalás – Sportabilia.hu" },
      {
        property: "og:description",
        content: "Személyes hitelesítési időpont foglalása szakértőinkhez.",
      },
    ],
  }),
  component: Booking,
});

const times = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

function Booking() {
  const [form, setForm] = useState({
    date: "",
    time: "",
    lastName: "",
    firstName: "",
    description: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [done, setDone] = useState(false);
  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm({ ...form, [k]: e.target.value });
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="mx-auto max-w-2xl px-4 py-14">
      <p className="text-xs uppercase tracking-[0.3em] text-primary">
        Szakértői vizsgálat
      </p>
      <h1 className="mt-2 text-4xl font-bold">Időpontfoglalás</h1>
      <p className="mt-3 text-muted-foreground">
        Töltse ki az űrlapot, és hitelesítőnk a megadott időpontban várja Önt
        budapesti irodánkban.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
        className="mt-10 space-y-5 rounded-lg border border-border bg-card p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Dátum</Label>
            <Input
              id="date"
              type="date"
              min={today}
              required
              value={form.date}
              onChange={set("date")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Időpont</Label>
            <select
              id="time"
              required
              value={form.time}
              onChange={set("time")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="" className="bg-card">
                Válasszon…
              </option>
              {times.map((t) => (
                <option key={t} className="bg-card">
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ln">Vezetéknév</Label>
            <Input
              id="ln"
              required
              maxLength={60}
              value={form.lastName}
              onChange={set("lastName")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fn">Keresztnév</Label>
            <Input
              id="fn"
              required
              maxLength={60}
              value={form.firstName}
              onChange={set("firstName")}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="desc">A tárgy leírása</Label>
          <Textarea
            id="desc"
            required
            rows={5}
            maxLength={1000}
            value={form.description}
            onChange={set("description")}
            placeholder="Pl. dedikált labda, eredet, ismert történet…"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="files">Fotók és dokumentumok (opcionális)</Label>
          <Input
            id="files"
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
          {files.length > 0 && (
            <ul className="text-sm text-muted-foreground">
              {files.map((f) => (
                <li key={f.name}>• {f.name}</li>
              ))}
            </ul>
          )}
        </div>
        <Button type="submit" size="lg" className="w-full">
          Időpont foglalása
        </Button>
      </form>

      <Dialog open={done} onOpenChange={setDone}>
        <DialogContent>
          <DialogHeader>
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <DialogTitle>Foglalását rögzítettük!</DialogTitle>
            <DialogDescription>
              Kedves {form.lastName} {form.firstName}, várjuk {form.date} napon{" "}
              {form.time} órakor.{" "}
              {files.length > 0 && `${files.length} csatolmány érkezett.`}{" "}
              Visszaigazolást hamarosan küldünk.
            </DialogDescription>
          </DialogHeader>
          <Button asChild>
            <Link to="/">Vissza a főoldalra</Link>
          </Button>
        </DialogContent>
      </Dialog>
    </main>
  );
}
