"use client";

import { useCart } from "@/context/useCart";
import { X } from "lucide-react";
import styles from "./CartSidebar.module.css";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CartSidebar() {
  const { cart, removeFromCart, isSidebarOpen, closeSidebar, clearCart } =
    useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [total, setTotal] = useState<number>(0);

  const removeTickets = () => {
    const query = new URLSearchParams(Array.from(searchParams.entries()));
    query.delete("tickets");
    router.replace(`${pathname}?${query.toString()}`);
  };

  const handleRemove = (raffleId: number) => {
    removeFromCart(raffleId);

    const currentRaffleId = Number(pathname.split("/")[2]);
    if (currentRaffleId === raffleId) {
      removeTickets();
    }
  };

  const handleClearCart = () => {
    clearCart();

    removeTickets();
  };

  const handleCheckout = () => {
    router.push("/checkout");
    closeSidebar();
  };

  useEffect(() => {
    const newTotal = cart.reduce((acc, item) => {
      return acc + (item.price ?? 0) * item.tickets.length;
    }, 0);

    setTotal(newTotal);
  }, [cart]);

  return (
    <>
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar} />
      )}

      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <h2>Mi carrito</h2>
          <button onClick={closeSidebar} className={styles.closeBtn}>
            <X size={20} color="#003748" />
          </button>
        </div>

        {cart.length > 0 && (
          <div className={styles.clearWrapper}>
            <button className={styles.clearBtn} onClick={handleClearCart}>
              Vaciar carrito
            </button>
          </div>
        )}

        <div className={styles.content}>
          {cart.length === 0 ? (
            <p className={styles.empty}>No hay rifas agregadas al carrito</p>
          ) : (
            cart.map((item) => (
              <div key={item.raffleId} className={styles.item}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={item.productImage}
                    alt={item.title}
                    fill
                    quality={100}
                    className={styles.image}
                  />
                </div>
                <div className={styles.info}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.tickets}>
                    {item.price} USD x {item.tickets.length} ticket(s)
                    seleccionados
                  </p>
                  <p className={styles.tickets}>
                    Subtotal:
                    <strong>
                      {" "}
                      {(item.price ?? 0) * item.tickets.length} USD
                    </strong>
                  </p>
                  <div className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        router.push(
                          `/raffle/${
                            item.raffleId
                          }/tickets?tickets=${item.tickets
                            .map((t) => t.number)
                            .join(",")}`
                        );
                        closeSidebar();
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemove(item.raffleId)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className={styles.footerContainer}>
            <p className={styles.title}>Total a pagar: {total} USD</p>
            <div className={styles.footer}>
              <button className={styles.checkoutBtn} onClick={handleCheckout}>
                Comprar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
