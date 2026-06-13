import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/catalog.queries";

export type CartItem = { product: Product; qty: number };

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  totalText: string;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "sp_cart_v2";

const fmt = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USD";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((a, i) => a + i.qty, 0);
    const total = items.reduce((a, i) => a + i.product.priceUSD * i.qty, 0);
    return {
      items,
      count,
      total,
      totalText: fmt(total),
      add: (p, qty = 1) =>
        setItems((prev) => {
          const found = prev.find((i) => i.product._id === p._id);
          if (found) return prev.map((i) => (i.product._id === p._id ? { ...i, qty: i.qty + qty } : i));
          return [...prev, { product: p, qty }];
        }),
      remove: (id) => setItems((prev) => prev.filter((i) => i.product._id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => i.product._id !== id)
            : prev.map((i) => (i.product._id === id ? { ...i, qty } : i))
        ),
      clear: () => setItems([]),
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside CartProvider");
  return v;
}
