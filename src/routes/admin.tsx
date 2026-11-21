import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { itemStore, useItems, type Item } from "@/items";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin – Sportabilia.hu" },
      { name: "description", content: "Tanúsított tárgyak kezelése." },
      { property: "og:title", content: "Admin – Sportabilia.hu" },
      {
        property: "og:description",
        content: "Adminisztrációs felület a tanúsított tárgyak kezeléséhez.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const empty = (): Item => ({
  id: `SPA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1e6)).padStart(6, "0")}`,
  name: "",
  description: "",
  certifier: "",
  images: [],
  category: "",
  year: "",
  history: "",
  provenance: "",
  condition: "",
  certifiedAt: new Date().toISOString().slice(0, 10),
  estimatedValue: "",
  attachments: [],
});

const fields: { k: keyof Item; l: string; area?: boolean }[] = [
  { k: "id", l: "Leltári szám" },
  { k: "name", l: "Megnevezés" },
  { k: "certifier", l: "Hitelesítő" },
  { k: "category", l: "Kategória" },
  { k: "year", l: "Évszám" },
  { k: "certifiedAt", l: "Hitelesítés dátuma" },
  { k: "condition", l: "Állapot" },
  { k: "estimatedValue", l: "Becsült érték" },
  { k: "description", l: "Rövid leírás", area: true },
  { k: "history", l: "Történet", area: true },
  { k: "provenance", l: "Tulajdonosi lánc", area: true },
];

function Admin() {
  const items = useItems();
  const [edit, setEdit] = useState<Item | null>(null);
  const [isNew, setIsNew] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    itemStore.upsert(edit);
    toast.success(isNew ? "Tárgy hozzáadva" : "Módosítások mentve");
    setEdit(null);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">
            Adminisztráció
          </p>
          <h1 className="mt-2 text-4xl font-bold">Tárgyak kezelése</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Demó mód – a változások csak a böngésző munkamenetében élnek.
          </p>
        </div>
        <Button
          onClick={() => {
            setEdit(empty());
            setIsNew(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Új tárgy
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Kép</th>
              <th className="p-3">Leltári szám</th>
              <th className="p-3">Megnevezés</th>
              <th className="p-3">Hitelesítő</th>
              <th className="p-3">Dátum</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t border-border">
                <td className="p-3">
                  {i.images[0] ? (
                    <img
                      src={i.images[0]}
                      alt=""
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded bg-muted" />
                  )}
                </td>
                <td className="p-3 font-mono">{i.id}</td>
                <td className="p-3">{i.name}</td>
                <td className="p-3">{i.certifier}</td>
                <td className="p-3">{i.certifiedAt}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Szerkesztés"
                    onClick={() => {
                      setEdit({ ...i });
                      setIsNew(false);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Törlés"
                    onClick={() => {
                      if (confirm("Biztosan törli?")) {
                        itemStore.remove(i.id);
                        toast("Tárgy törölve");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isNew ? "Új tárgy felvétele" : "Tárgy szerkesztése"}
            </DialogTitle>
          </DialogHeader>
          {edit && (
            <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
              {fields.map(({ k, l, area }) => (
                <div
                  key={k}
                  className={`space-y-1 ${area ? "sm:col-span-2" : ""}`}
                >
                  <Label htmlFor={k}>{l}</Label>
                  {area ? (
                    <Textarea
                      id={k}
                      rows={3}
                      value={edit[k] as string}
                      onChange={(e) =>
                        setEdit({ ...edit, [k]: e.target.value })
                      }
                    />
                  ) : (
                    <Input
                      id={k}
                      required={["id", "name", "certifier"].includes(k)}
                      disabled={k === "id" && !isNew}
                      value={edit[k] as string}
                      onChange={(e) =>
                        setEdit({ ...edit, [k]: e.target.value })
                      }
                    />
                  )}
                </div>
              ))}
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="imgs">Képek</Label>
                <Input
                  id="imgs"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const urls = Array.from(e.target.files ?? []).map((f) =>
                      URL.createObjectURL(f),
                    );
                    setEdit({ ...edit, images: [...edit.images, ...urls] });
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  {edit.images.map((src, idx) => (
                    <button
                      type="button"
                      key={idx}
                      title="Eltávolítás"
                      onClick={() =>
                        setEdit({
                          ...edit,
                          images: edit.images.filter((_, j) => j !== idx),
                        })
                      }
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-16 w-16 rounded object-cover hover:opacity-50"
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="att">
                  Csatolmányok (tanúsítvány, vizsgálati jegyzőkönyv)
                </Label>
                <Input
                  id="att"
                  type="file"
                  multiple
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      attachments: [
                        ...edit.attachments,
                        ...Array.from(e.target.files ?? []).map((f) => f.name),
                      ],
                    })
                  }
                />
                <ul className="text-sm text-muted-foreground">
                  {edit.attachments.map((a, idx) => (
                    <li key={idx}>
                      • {a}{" "}
                      <button
                        type="button"
                        className="text-destructive"
                        onClick={() =>
                          setEdit({
                            ...edit,
                            attachments: edit.attachments.filter(
                              (_, j) => j !== idx,
                            ),
                          })
                        }
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end gap-2 sm:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEdit(null)}
                >
                  Mégse
                </Button>
                <Button type="submit">Mentés</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
