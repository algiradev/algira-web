"use client";

import { Tooltip } from "react-tooltip";
import { HiArrowSmRight } from "react-icons/hi";
import styles from "./TicketSelector.module.css";
import Button from "../button/Button";
import { useCart } from "@/context/useCart";
import { MyRaffle } from "@/types/raffle";
import { useSocket } from "@/providers/SocketProvider";
import { useEffect, useState } from "react";

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
  const [user, setUser] = useState<{ id: number } | null>(null);
  const { socket } = useSocket(); // asumimos que user está en el provider de socket
  const [unavailable, setUnavailable] = useState<Ticket[]>(unavailableTickets);
  const [selected, setSelected] = useState<Ticket[]>(selectedTickets);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Mantener actualizado el estado de unavailable desde props
  useEffect(() => {
    setUnavailable(unavailableTickets);
  }, [unavailableTickets]);

  // Mantener seleccionado en sync con props
  useEffect(() => {
    setSelected(selectedTickets);
  }, [selectedTickets]);

  // Bloquear compra si la rifa está a menos de 3 minutos
  useEffect(() => {
    const checkBlocked = () => {
      const now = Date.now();
      const end = new Date(raffle.endDate ?? "00/00/0000").getTime();
      setBlocked(end - now <= 3 * 60 * 1000);
    };

    checkBlocked();
    const interval = setInterval(checkBlocked, 1000);
    return () => clearInterval(interval);
  }, [raffle.endDate]);

  // Suscribirse a actualizaciones del socket
  useEffect(() => {
    if (!socket) return;

    const handleRaffleUpdate = (data: {
      raffleId: number;
      ticketsBought: number[];
      buyerId: number;
    }) => {
      const { raffleId, ticketsBought, buyerId } = data;
      if (raffleId !== raffle.id) return;
      if (!user) return;

      // Solo afecta a otros usuarios, no al que compró
      if (buyerId !== user.id) {
        // Marcar tickets comprados como no disponibles
        setUnavailable((prev) => [
          ...prev,
          ...ticketsBought
            .filter((num) => !prev.some((t) => t.number === num))
            .map((num) => ({ id: num, number: num })),
        ]);

        // Desmarcar tickets seleccionados que fueron comprados por otros
        setSelected((prev) =>
          prev.filter((t) => !ticketsBought.includes(t.number ?? -1))
        );
      }
    };

    socket.on("raffle:update", handleRaffleUpdate);
    return () => {
      socket.off("raffle:update", handleRaffleUpdate);
    };
  }, [socket, raffle.id, user]);

  // Ordenamos los tickets deshabilitados
  const sortedUnavailable = [...unavailable].sort(
    (a, b) => (a.number ?? 0) - (b.number ?? 0)
  );

  // Construcción de checkboxes
  const buildCheckboxButton = () => {
    if (!options || options.length === 0) {
      return <small className={styles.noNumber}>Número no disponible</small>;
    }

    return options.map((opt) => {
      const isSelected = !!selected.find((st) => st.number === opt.number);
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

  if (blocked) {
    return (
      <div className={styles.wrapper}>
        <h2>Las compras para esta rifa se han cerrado</h2>
        <p>El sorteo comenzará en breve. ¡Suerte!</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>
        Para comenzar selecciona los números que quieras comprar.
      </h2>

      <div className={styles.card}>{buildCheckboxButton()}</div>

      <div className={styles.buttonWrapper}>
        <Button
          className={styles.nextButton}
          disabled={selected.length === 0}
          onClick={() => {
            addToCart({
              raffleId: raffle.id ?? 0,
              title: raffle.title ?? "",
              productImage: raffle.product.image?.[0] ?? "",
              price: raffle.price ?? 0,
              endDate: raffle.endDate,
              tickets: selected.map((ticket) => ({
                id: ticket.id,
                code: String(ticket.number),
                number: ticket.number,
              })),
            });
            openSidebar();
          }}
        >
          {selected.length === 0
            ? "Seleccione un ticket"
            : "Agregar al carrito"}
          {selected.length > 0 && <HiArrowSmRight className={styles.icon} />}
        </Button>
      </div>
    </div>
  );
}
