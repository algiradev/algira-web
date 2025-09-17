"use client";

import { Tooltip } from "react-tooltip";
import { HiArrowSmRight } from "react-icons/hi";
import styles from "./TicketSelector.module.css";
import Button from "../button/Button";
import { useCart } from "@/context/useCart";
import { MyRaffle } from "@/types/raffle";

export interface Ticket {
  id: number;
  number?: number;
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
  const { addToCart, openSidebar } = useCart();

  // Ordenamos los tickets deshabilitados
  const sortedUnavailable = [...unavailableTickets].sort(
    (a, b) => (a.number ?? 0) - (b.number ?? 0)
  );

  // Construcción de checkboxes
  const buildCheckboxButton = () => {
    if (!options || options.length === 0) {
      return <small className={styles.noNumber}>Número no disponible</small>;
    }

    return options.map((opt) => {
      const isSelected = !!selectedTickets.find(
        (st) => st.number === opt.number
      );
      const isUnavailable = !!sortedUnavailable.find(
        (t) => t.number === opt.number
      );

      return (
        <label
          key={opt.id}
          htmlFor={opt.id.toString()}
          className={styles.ticketLabel}
          data-tooltip-id={isUnavailable ? opt.id.toString() : undefined}
        >
          {isUnavailable && (
            <Tooltip id={opt.id.toString()} place="top">
              No disponible
            </Tooltip>
          )}
          <input
            type="checkbox"
            id={opt.id.toString()}
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

      <div className={styles.card}>{buildCheckboxButton()}</div>

      <div className={styles.buttonWrapper}>
        <Button
          className={styles.nextButton}
          disabled={selectedTickets.length === 0}
          onClick={() => {
            addToCart({
              raffleId: raffle.id ?? 0,
              title: raffle.title ?? "",
              productImage: raffle.product.image?.[0] ?? "",
              price: raffle.price ?? 0,
              tickets: selectedTickets.map((ticket) => ({
                id: ticket.id,
                code: String(ticket.number),
                number: ticket.number,
              })),
            });
            openSidebar();
            console.log("title", raffle.title);
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
