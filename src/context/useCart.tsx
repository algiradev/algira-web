"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from "react";
import { MyTicket } from "@/types/ticket";
import { io } from "socket.io-client";

export type CartItem = {
  raffleId: number;
  title: string;
  productImage: string;
  tickets: MyTicket[];
  price?: number;
};

type CartContextType = {
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (raffleId: number) => void;
  clearCart: () => void;
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const cartRef = useRef<CartItem[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ id: number } | null>(null);

  // mantener ref actualizada para evitar closures stale en sockets
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // cargar desde localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // guardar en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ---------- funciones memoizadas ----------
  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.raffleId === item.raffleId);
      if (existing) {
        return prev.map((c) =>
          c.raffleId === item.raffleId
            ? {
                ...c,
                tickets: item.tickets,
                price: item.price ?? c.price ?? 0,
                title: item.title ?? c.title,
                productImage: item.productImage ?? c.productImage,
              }
            : c
        );
      }
      return [...prev, { ...item, price: item.price ?? 0 }];
    });
  }, []);

  const removeFromCart = useCallback((raffleId: number) => {
    setCart((prev) => prev.filter((c) => c.raffleId !== raffleId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  // escuchar evento global de limpieza (logout)
  useEffect(() => {
    const handler = () => clearCart();
    window.addEventListener("clear-cart", handler);
    return () => window.removeEventListener("clear-cart", handler);
  }, [clearCart]);

  // ---------- SOCKET ----------
  useEffect(() => {
    const socket = io(STRAPI_URL, { transports: ["websocket"] });

    socket.on("connect", () => {});

    socket.on(
      "raffle:update",
      (payload: {
        raffleId: number;
        ticketsBought: (number | string)[];
        buyerId: number;
      }) => {
        const { raffleId, ticketsBought, buyerId } = payload;
        if (!user || buyerId === user.id) return;

        // usar la ref para obtener el cart actual
        const currentItem = cartRef.current.find(
          (i) => i.raffleId === raffleId
        );
        if (!currentItem) return;

        const boughtSet = new Set(ticketsBought.map(String));
        const ticketsToKeep = currentItem.tickets.filter(
          (t) => !boughtSet.has(String(t.number))
        );

        if (ticketsToKeep.length === 0) {
          // eliminar rifa completa
          removeFromCart(raffleId);
        } else {
          // reusar addToCart para mantener la misma lógica y estructura
          addToCart({
            raffleId: currentItem.raffleId,
            title: currentItem.title,
            productImage: currentItem.productImage,
            price: currentItem.price,
            tickets: ticketsToKeep,
          });
        }
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [user, addToCart, removeFromCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.reduce((acc, c) => acc + c.tickets.length, 0),
        addToCart,
        removeFromCart,
        clearCart,
        isSidebarOpen,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
