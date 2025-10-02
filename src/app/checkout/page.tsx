"use client";

import { useEffect, useRef, useState } from "react";
import type { Dropin } from "braintree-web-drop-in";
import { useCart } from "@/context/useCart";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./Checkout.module.css";
import { generateClientToken, processPayment } from "@/lib/api/braintree";
import dropin from "braintree-web-drop-in";
import { toast } from "react-toastify";
import Loader from "@/components/loader/Loader";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [clientToken, setClientToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<boolean>(false);

  const dropinContainerRef = useRef<HTMLDivElement>(null);
  const dropinInstance = useRef<Dropin | null | undefined>(undefined);

  useEffect(() => {
    if (!user) {
      toast.info("Por favor, ingrese para poder realizar compras");
      router.push(`/login?redirect=/checkout`);
    }
  }, [user, router]);

  //   if (!user) return null;

  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        const token = await generateClientToken();
        setClientToken(token);
      } catch (err) {
        console.error(err);
        toast.error("Error al obtener el token de pago");
      }
    };

    fetchClientToken();
  }, []);

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.tickets.length,
    0
  );

  useEffect(() => {
    if (!clientToken || !dropinContainerRef.current) return;

    dropin.create(
      {
        authorization: clientToken,
        container: dropinContainerRef.current,
        // paypal: { flow: "vault" },
      },
      (err, instance) => {
        if (err) {
          console.error(err);
          return;
        }
        dropinInstance.current = instance;
      }
    );

    return () => {
      if (dropinInstance.current) {
        dropinInstance.current.teardown();
      }
    };
  }, [clientToken]);

  useEffect(() => {
    if (cart.length === 0 && !orderResult) {
      router.push("/");
    }
  }, [cart, router, orderResult]);

  const handleBuy = async () => {
    if (!dropinInstance.current) return;
    setLoading(true);
    try {
      const payload = await dropinInstance.current.requestPaymentMethod();

      const rafflesIds = cart.map((item) => item.raffleId);
      const ticketsForPayment = cart.flatMap((item) =>
        item.tickets.map((t) => ({
          number: t.number ?? 0,
          raffleId: item.raffleId,
        }))
      );
      const totalAmount = cart.reduce(
        (sum, item) => sum + (item.price ?? 0) * item.tickets.length,
        0
      );

      const data = await processPayment({
        paymentMethodNonce: payload.nonce,
        amount: totalAmount,
        raffles: rafflesIds,
        tickets: ticketsForPayment,
      });

      if (data.success) {
        router.push("/thank-you");
        setOrderResult(true);
        toast.success("Pago procesado correctamente ✅");
        clearCart();
      } else {
        toast.error("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error procesando el pago");
    } finally {
      setLoading(false);
    }
  };

  if (loading) <Loader />;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Checkout</h1>

      {/* Resumen del carrito */}
      <div className={styles.cartSummary}>
        {cart.length === 0 ? (
          <p>No hay productos en el carrito</p>
        ) : (
          cart.map((item) => (
            <div key={item.raffleId} className={styles.cartItem}>
              <h3>{item.title}</h3>
              <p>
                Tickets:{" "}
                {item.tickets
                  .map((t) => t.number ?? 0)
                  .sort((a, b) => a - b)
                  .join(", ")}
              </p>
              <p>
                {item.tickets.length} x ${item.price} ={" "}
                <strong>
                  ${(item.tickets.length * (item.price ?? 0)).toFixed(2)}
                </strong>
              </p>
            </div>
          ))
        )}
        <div className={styles.total}>Total: ${totalAmount.toFixed(2)}</div>
      </div>

      {/* Drop-in */}
      {!clientToken ? (
        <p>Cargando pasarela de pago...</p>
      ) : (
        <div ref={dropinContainerRef} className={styles.dropinContainer} />
      )}

      {/* Botón de pago */}
      <button onClick={handleBuy} className={styles.payButton}>
        {loading ? "Procesando..." : "Pagar ahora"}
      </button>
    </div>
  );
}
