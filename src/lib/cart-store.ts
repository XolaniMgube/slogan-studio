"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./types";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  grade: Product["grade"];
  image: string;
  qty: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const SHIPPING_FLAT = 150;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (product, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, qty: Math.min(i.qty + qty, i.stock) } : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                grade: product.grade,
                image: product.images[0],
                qty: Math.min(qty, product.stock),
                stock: product.stock,
              },
            ],
            isOpen: true,
          };
        }),
      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i))
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    { name: "slogan-cart" }
  )
);

/* selectors */
export const selectCount = (s: CartState) => s.items.reduce((n, i) => n + i.qty, 0);
export const selectSubtotal = (s: CartState) => s.items.reduce((n, i) => n + i.price * i.qty, 0);
