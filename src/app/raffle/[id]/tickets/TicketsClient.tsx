"use client";

import { useState, useEffect } from "react";
import TicketSelector, {
  Ticket,
} from "@/components/ticketSelector/TicketSelector";
import styles from "./TicketsClient.module.css";
import { MyRaffle } from "@/types/raffle";
import Raffle from "../../page";
import { MyTicket } from "@/types/ticket";
import BackButton from "@/components/button/BackButton";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/useCart";

type TicketsClientProps = {
  raffle: MyRaffle;
};

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function TicketsClient({ raffle }: TicketsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { removeFromCart } = useCart();
  // parsear tickets desde params al inicio
  const preselectedTicketsParam = searchParams.get("tickets");
  const preselectedTickets: Ticket[] = preselectedTicketsParam
    ? preselectedTicketsParam.split(",").map((num, i) => ({
        id: String(i + 1),
        number: Number(num),
      }))
    : [];

  const [selected, setSelected] = useState<Ticket[]>(preselectedTickets);

  // 1. Generamos todos los tickets de 1 a maxQuantity
  const tickets: Ticket[] = Array.from(
    { length: raffle.maxQuantity ?? 0 },
    (_, i) => ({
      id: String(i + 1),
      number: i + 1,
    })
  );

  // 2. Filtramos los no disponibles según raffle.tickets
  const unavailable: Ticket[] =
    raffle.tickets
      ?.filter((t: MyTicket) => t.status_ticket !== "a")
      .map((t) => ({
        id: String(t.number ?? 0),
        number: t.number ?? 0,
      })) ?? [];

  // manejar selección y actualizar query params
  const handledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value);
    let newSelected: Ticket[];
    if (e.target.checked) {
      newSelected = [...selected, { id: e.target.id, number: num }];
    } else {
      newSelected = selected.filter((t) => t.number !== num);
    }
    setSelected(newSelected);

    // actualizar los query params
    const query = new URLSearchParams(Array.from(searchParams.entries()));
    if (newSelected.length > 0) {
      query.set("tickets", newSelected.map((t) => t.number).join(","));
    } else {
      query.delete("tickets");
    }
    router.replace(`${pathname}?${query.toString()}`);
  };

  const handleOnClick = () => {
    console.log("Tickets seleccionados:", selected);
    // Aquí puedes agregar al carrito o navegar a paso2
  };

  const total = selected.length * (raffle.price ?? 0);

  const formattedRaffle = {
    id: raffle.id ?? 0,
    endDate: raffle.endDate ?? new Date().toISOString(),
    price: raffle.price ?? 0,
    quantityAvailable: raffle.maxQuantity ?? 0,
    product: {
      id: raffle.product?.id ?? 0,
      title: raffle.product?.title ?? "",
      shortDescription: raffle.product?.shortDescription ?? "",
      description: raffle.product?.description ?? "",
      image:
        raffle.product?.image?.map((img: string) =>
          img.startsWith("http") ? img : STRAPI_URL + img
        ) ?? [],
    },
  };

  useEffect(() => {
    const ticketsParam = searchParams.get("tickets");
    const updatedSelected: Ticket[] = ticketsParam
      ? ticketsParam.split(",").map((num, i) => ({
          id: String(i + 1),
          number: Number(num),
        }))
      : [];
    setSelected(updatedSelected);
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <div className={styles.backButtonWrapper}>
        <BackButton />
      </div>
      <div className={styles.left}>
        <TicketSelector
          options={tickets}
          selectedTickets={selected}
          unavailableTickets={unavailable}
          handledChange={handledChange}
          handleOnClick={handleOnClick}
          raffle={formattedRaffle}
        />
      </div>
      <div className={styles.right}>
        <Raffle raffle={formattedRaffle} isSale total={total} hideBuyButton />
      </div>
    </div>
  );
}
