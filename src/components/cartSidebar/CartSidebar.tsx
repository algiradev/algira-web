"use client";

import { useCart } from "@/context/useCart";
import { X } from "lucide-react";
import styles from "./CartSidebar.module.css";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function CartSidebar() {
  const { cart, removeFromCart, isSidebarOpen, closeSidebar, clearCart } =
    useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleRemove = (raffleId: number) => {
    removeFromCart(raffleId);

    // Limpiar tickets en params si estamos en la página de esa rifa
    const currentRaffleId = Number(pathname.split("/")[2]);
    if (currentRaffleId === raffleId) {
      const query = new URLSearchParams(Array.from(searchParams.entries()));
      query.delete("tickets");
      router.replace(`${pathname}?${query.toString()}`);
    }
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    // Aquí redirigimos a la futura pasarela de pago
    router.push("/checkout");
    closeSidebar();
  };

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
                <img
                  src={item.productImage}
                  alt={item.raffleTitle}
                  className={styles.image}
                />
                <div className={styles.info}>
                  <h3 className={styles.title}>{item.raffleTitle}</h3>
                  <p className={styles.tickets}>
                    {item.tickets.length} ticket(s) seleccionados
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
          <div className={styles.footer}>
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Comprar
            </button>
          </div>
        )}
      </div>
    </>
  );
}
