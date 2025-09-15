"use client";

import { useEffect, useRef, useState } from "react";
import DropIn from "braintree-web-drop-in-react";
import type { Dropin as BraintreeDropin, Dropin } from "braintree-web-drop-in";
import { useCart } from "@/context/useCart";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import type { PaymentResponse } from "@/types/payment";
import styles from "./Checkout.module.css";
import { generateClientToken } from "@/lib/api/braintree";
import dropin from "braintree-web-drop-in";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [clientToken, setClientToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<PaymentResponse | null>(null);

  const dropinContainerRef = useRef<HTMLDivElement>(null);
  const dropinInstance = useRef<Dropin | null | undefined>(undefined);

  useEffect(() => {
    if (!user) {
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

  const handleBuy = async () => {
    if (!dropinInstance.current) return;
    setLoading(true);
    try {
      const payload = await dropinInstance.current.requestPaymentMethod();
      const ticketsIds = cart.flatMap((item) => item.tickets.map((t) => t.id));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/braintree/process-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethodNonce: payload.nonce,
            tickets: ticketsIds,
          }),
        }
      );

      const data: PaymentResponse = await res.json();
      setOrderResult(data);

      if (data.success) {
        clearCart();
        toast.success("Pago procesado correctamente ✅");
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
              <h3>{item.raffleTitle}</h3>
              <p>Tickets: {item.tickets.map((t) => t.number).join(", ")}</p>
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
      <button
        onClick={handleBuy}
        disabled={loading || !dropinInstance.current || cart.length === 0}
        className={styles.payButton}
      >
        {loading ? "Procesando..." : "Pagar ahora"}
      </button>

      {/* Resultado de la orden */}
      {orderResult && (
        <div className={styles.orderResult}>
          {orderResult.success ? (
            <>
              <h3>Pago exitoso 🎉</h3>
              <p>Transacción: {orderResult.order?.transactionId}</p>
              <p>Monto: ${orderResult.order?.amount.toFixed(2)}</p>
            </>
          ) : (
            <p className={styles.error}>Error: {orderResult.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
