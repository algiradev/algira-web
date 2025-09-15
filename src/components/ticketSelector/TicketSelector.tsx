"use client";

import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { toast } from "react-toastify";
import { HiArrowSmRight } from "react-icons/hi";
import styles from "./TicketSelector.module.css";
import Button from "../button/Button";
import { useCart } from "@/context/useCart";
import { MyRaffle } from "@/types/raffle";

export interface Ticket {
  id: string;
  number: number;
}

interface TicketSelectorProps {
  raffle: MyRaffle;
  options: Ticket[];
  selectedTickets: Ticket[];
  unavailableTickets: Ticket[];
  handledChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddToCartOpenSidebar?: () => void;
}

export default function TicketSelector({
  raffle,
  options,
  selectedTickets,
  unavailableTickets,
  handledChange,
}: TicketSelectorProps) {
  const [opts, setOpts] = useState<Ticket[]>(options);
  const { addToCart, openSidebar } = useCart();
  const sortedTickets = [...unavailableTickets].sort(
    (a, b) => a.number - b.number
  );

  const handleListFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const filtered = options.filter(
        (o) => o.number === parseInt(e.target.value)
      );
      setOpts(filtered);
    } else {
      setOpts(options);
    }
  };

  const buildCheckboxButton = () => {
    if (!opts || opts.length === 0) {
      return <small className={styles.noNumber}>Número no disponible</small>;
    }

    return opts.map((opt) => {
      const isSelected = !!selectedTickets.find(
        (st) => st.number === opt.number
      );
      const isUnavailable = !!sortedTickets.find(
        (t) => t.number === opt.number
      );

      return (
        <label
          key={opt.id}
          htmlFor={opt.id}
          className={styles.ticketLabel}
          data-tooltip-id={isUnavailable ? opt.id : undefined}
        >
          {isUnavailable && (
            <Tooltip id={opt.id} place="top">
              No disponible
            </Tooltip>
          )}
          <input
            type="checkbox"
            id={opt.id}
            value={opt.number}
            disabled={isUnavailable}
            checked={isSelected}
            onChange={handledChange}
            className={styles.hiddenInput}
          />
          <span
            className={`${styles.ticket} ${isSelected ? styles.selected : ""}${
              isUnavailable ? styles.unavailable : ""
            }`}
          >
            {opt.number}
          </span>
        </label>
      );
    });
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>
        Para comenzar selecciona los números que quieras comprar.
      </h2>

      <div className={styles.searchBox}>
        <label htmlFor="search" className={styles.searchLabel}>
          Buscar:
        </label>
        <input
          id="search"
          type="number"
          name="search"
          onChange={handleListFilter}
          className={styles.searchInput}
        />
      </div>

      <div className={`${styles.card} animate__animated animate__fadeIn`}>
        {buildCheckboxButton()}
      </div>

      <div className={styles.buttonWrapper}>
        <Button
          className={styles.nextButton}
          disabled={selectedTickets.length === 0}
          onClick={() => {
            addToCart({
              raffleId: raffle.id ?? 0,
              raffleTitle: raffle.product.title ?? "",
              productImage: raffle.product.image?.[0] ?? "",
              price: raffle.price ?? 0,
              tickets: selectedTickets.map((ticket) => ({
                id: Number(ticket.id),
                code: String(ticket.number),
                number: ticket.number,
              })),
            });
            openSidebar();
          }}
        >
          {selectedTickets.length === 0
            ? "Seleccione un ticket"
            : "Agregar al carrito"}
          {selectedTickets.length > 0 && (
            <HiArrowSmRight className={styles.icon} />
          )}
        </Button>
      </div>
    </div>
  );
}
