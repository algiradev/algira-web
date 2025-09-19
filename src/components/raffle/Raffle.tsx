"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Raffle.module.css";
import { MyRaffle } from "@/types/raffle";
import { useCart } from "@/context/useCart";
import { useMemo } from "react";
import { formatDateTime } from "@/utils/formatDate";

export interface RaffleProps {
  raffle: MyRaffle;
  user?: boolean;
  unavailable?: boolean;
  isSale?: boolean;
  total?: number;
  hideBuyButton?: boolean;
}

export default function Raffle({
  raffle,
  unavailable = false,
  isSale = false,
  total,
  hideBuyButton = false,
}: RaffleProps) {
  const { cart } = useCart();

  const ticketsInCart = useMemo(() => {
    const item = cart.find((c) => c.raffleId === raffle.id);
    return item ? item.tickets.map((t) => t.number).join(",") : "";
  }, [cart, raffle.id]);

  const endDate = new Date(raffle.endDate || "");
  const today = new Date();

  return (
    <article
      className={`${styles.article} ${unavailable ? styles.unavailable : ""}`}
    >
      <Link href={`/raffle/${raffle.id}`}>
        <figure className={styles.imgBox}>
          <Image
            src={raffle.product?.image?.[0] || "/algira.svg"}
            alt={"raffle.post.title"}
            width={270}
            height={220}
            className={styles.img}
          />
        </figure>
      </Link>

      <section className={styles.contentBox}>
        <h2 className={styles.title}>{raffle.product.title}</h2>

        <div className={styles.size}>
          <h3 className={styles.date}>Fecha de sorteo:</h3>
          <p className={styles.hour}>{formatDateTime(raffle.endDate)}</p>
        </div>

        <div className={styles.color}>
          <h3>Precio:</h3>
          <p>
            <strong>{raffle.price} USD</strong>
          </p>
        </div>

        {total !== undefined && total > 0 && (
          <div className={styles.color}>
            <h3>Total a pagar:</h3>
            <p>
              <strong>${total}</strong>
            </p>
          </div>
        )}

        {endDate < today ? (
          <Link
            href={`/results`}
            className={`${styles.button} ${styles.disabled}`}
          >
            Finalizado
          </Link>
        ) : isSale && (raffle.availableAmount || 0) > 0 && !hideBuyButton ? (
          <Link
            href={`/raffle/${raffle.id}/tickets${
              ticketsInCart ? `?tickets=${ticketsInCart}` : ""
            }`}
            className={styles.button}
          >
            Comprar Ticket
          </Link>
        ) : (
          isSale &&
          (raffle.availableAmount || 0) <= 0 && (
            <p className={styles.outOfStock}>Agotado</p>
          )
        )}
      </section>
    </article>
  );
}
