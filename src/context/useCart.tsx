"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { MyTicket } from "@/types/ticket";

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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.raffleId === item.raffleId);
      if (existing) {
        return prev.map((c) =>
          c.raffleId === item.raffleId
            ? {
                ...c,
                tickets: item.tickets,
                price: item.price ?? 0,
                raffleTitle: item.title,
              }
            : c
        );
      }
      return [...prev, { ...item, price: item.price ?? 0 }];
    });
  };

  const removeFromCart = (raffleId: number) => {
    setCart((prev) => prev.filter((c) => c.raffleId !== raffleId));
  };

  const clearCart = () => setCart([]);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.length,
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
