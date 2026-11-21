import { useSyncExternalStore } from "react";
import products from "./data/memorabilia.json";

const imageAssets = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("./assets/*.jpg", {
      eager: true,
      import: "default",
    }),
  ).map(([path, url]) => [path.slice("./assets/".length), url]),
);

export type Item = {
  id: string;
  name: string;
  description: string;
  certifier: string;
  images: string[];
  category: string;
  year: string;
  history: string;
  provenance: string;
  condition: string;
  certifiedAt: string;
  estimatedValue: string;
  attachments: string[];
};

let items: Item[] = products.map((product) => ({
  ...product,
  images: product.images.map((image) => imageAssets[image] ?? image),
}));

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export const itemStore = {
  get: () => items,
  find: (id: string) =>
    items.find((item) => item.id.toLowerCase() === id.trim().toLowerCase()),
  upsert: (item: Item) => {
    items = items.some((existing) => existing.id === item.id)
      ? items.map((existing) => (existing.id === item.id ? item : existing))
      : [item, ...items];
    emit();
  },
  remove: (id: string) => {
    items = items.filter((item) => item.id !== id);
    emit();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export const useItems = () =>
  useSyncExternalStore(itemStore.subscribe, itemStore.get, itemStore.get);
