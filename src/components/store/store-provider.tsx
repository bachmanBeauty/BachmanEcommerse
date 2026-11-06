"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const CART_KEY = "bb_cart_v1";
const WISHLIST_KEY = "bb_wishlist_v1";

const EMPTY_CART: CartItem[] = [];
const EMPTY_WISHLIST: WishlistItem[] = [];
const noopSubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export type CartItem = {
  key: string;
  productId: string;
  variantId: string | null;
  name: string;
  variantName: string | null;
  slug: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  maxQuantity: number;
};

export type WishlistItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
};

type StoreContextValue = {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (item: Omit<CartItem, "key" | "quantity">, quantity?: number) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isWishlisted: (productId: string) => boolean;
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

type LocalStore<T> = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (updater: T | ((previous: T) => T)) => void;
};

function createLocalStore<T>(key: string, initial: T): LocalStore<T> {
  let current = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded) return;
    loaded = true;
    current = readJson(key, initial);
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot() {
      load();
      return current;
    },
    getServerSnapshot() {
      return initial;
    },
    set(updater) {
      load();
      const next =
        typeof updater === "function"
          ? (updater as (previous: T) => T)(current)
          : updater;
      current = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Storage can be full or disabled; keep the in-memory state.
      }
      listeners.forEach((listener) => listener());
    },
  };
}

const cartStore = createLocalStore<CartItem[]>(CART_KEY, EMPTY_CART);
const wishlistStore = createLocalStore<WishlistItem[]>(
  WISHLIST_KEY,
  EMPTY_WISHLIST,
);

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const cart = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const wishlist = useSyncExternalStore(
    wishlistStore.subscribe,
    wishlistStore.getSnapshot,
    wishlistStore.getServerSnapshot,
  );
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    clientSnapshot,
    serverSnapshot,
  );

  const addItem = useCallback(
    (item: Omit<CartItem, "key" | "quantity">, quantity = 1) => {
      const key = item.variantId ?? item.productId;
      cartStore.set((current) => {
        const existing = current.find((entry) => entry.key === key);
        const nextQuantity = Math.min(
          (existing?.quantity ?? 0) + quantity,
          item.maxQuantity,
        );

        if (existing) {
          return current.map((entry) =>
            entry.key === key
              ? { ...entry, quantity: nextQuantity, price: item.price }
              : entry,
          );
        }

        return [...current, { ...item, key, quantity: nextQuantity }];
      });
    },
    [],
  );

  const removeItem = useCallback((key: string) => {
    cartStore.set((current) => current.filter((entry) => entry.key !== key));
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    cartStore.set((current) =>
      current
        .map((entry) =>
          entry.key === key
            ? {
                ...entry,
                quantity: Math.max(0, Math.min(quantity, entry.maxQuantity)),
              }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => cartStore.set([]), []);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    wishlistStore.set((current) => {
      const exists = current.some((entry) => entry.productId === item.productId);
      return exists
        ? current.filter((entry) => entry.productId !== item.productId)
        : [...current, item];
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: string) =>
      wishlist.some((entry) => entry.productId === productId),
    [wishlist],
  );

  const value = useMemo<StoreContextValue>(() => {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return {
      cart,
      cartCount,
      subtotal,
      hydrated,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      wishlist,
      toggleWishlist,
      isWishlisted,
    };
  }, [
    cart,
    hydrated,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    wishlist,
    toggleWishlist,
    isWishlisted,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}
