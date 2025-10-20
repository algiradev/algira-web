"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/useCart";
import { toast } from "react-toastify";

export default function useCheckoutCountdown() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const checkCountdown = () => {
      const now = Date.now();

      for (const item of cart) {
        if (!item.endDate) continue;
        const end = new Date(item.endDate).getTime();
        if (end - now <= 3 * 60 * 1000) {
          toast.warning(
            `La rifa "${item.title}" está por comenzar. No puedes continuar con la compra.`,
            { autoClose: 5000 }
          );
          clearCart();
          router.replace(`/raffle-room`);
          return;
        }
      }
    };

    checkCountdown();
    const interval = setInterval(checkCountdown, 1000);

    return () => clearInterval(interval);
  }, [cart, clearCart, router]);
}
