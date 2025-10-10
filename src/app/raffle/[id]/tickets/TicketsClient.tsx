"use client";

import { useState, useEffect, useMemo } from "react";
import TicketSelector, {
  Ticket,
} from "@/components/ticketSelector/TicketSelector";
import styles from "./TicketsClient.module.css";
import { MyRaffle } from "@/types/raffle";
import BackButton from "@/components/button/BackButton";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Raffle from "@/components/raffle/Raffle";
import { getPurchasedTickets } from "@/lib/api/ticket";

type TicketsClientProps = {
  raffle: MyRaffle;
};

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export default function TicketsClient({ raffle }: TicketsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [takenTickets, setTakenTickets] = useState<number[]>([]);

  const preselectedTicketsParam = searchParams.get("tickets");
  const preselectedTickets: Ticket[] = preselectedTicketsParam
    ? preselectedTicketsParam.split(",").map((num) => ({
        id: Number(1),
        number: Number(num),
      }))
    : [];

  const [selected, setSelected] = useState<Ticket[]>(preselectedTickets);

  // 1. Generamos todos los tickets de 1 a maxQuantity
  const tickets: Ticket[] = Array.from(
    { length: raffle.maxQuantity ?? 0 },
    (_, i) => ({
      id: i + 1,
      number: i + 1,
    })
  );

  const unavailable: Ticket[] = useMemo(() => {
    const takenSet = new Set<number>([
      // tickets marcados como inactivos en la rifa
      ...(raffle.tickets
        ?.filter((t) => t.status_ticket !== "a")
        .map((t) => t.number ?? 0) ?? []),
      // tickets ya comprados por otros usuarios (desde polling)
      ...takenTickets,
    ]);

    return tickets
      .filter((t) => takenSet.has(t.number ?? 0))
      .map((t) => ({
        id: t.id, // ✅ number (ya no String)
        number: t.number,
      }));
  }, [raffle.tickets, takenTickets, tickets]);

  const availableTickets: Ticket[] = useMemo(() => {
    const takenSet = new Set<number>(unavailable.map((t) => t.number ?? 0));
    return tickets.filter((t) => !takenSet.has(t.number ?? 0));
  }, [tickets, unavailable]);

  // manejar selección y actualizar query params
  const handledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value);
    let newSelected: Ticket[];
    if (e.target.checked) {
      newSelected = [...selected, { id: parseInt(e.target.id), number: num }];
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

  const total = selected.length * (raffle.price ?? 0);

  const formattedRaffle = {
    id: raffle.id ?? 0,
    endDate: raffle.endDate ?? new Date().toISOString(),
    price: raffle.price ?? 0,
    title: raffle.title ?? "",
    tickets:
      raffle.tickets?.map((t) => ({
        id: t.id,
        number: t.number,
        code: t.code ?? "",
        raffle: t.raffle ?? null,
        status_ticket: t.status_ticket,
      })) ?? [],
    availableAmount: availableTickets.length,
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
          id: i + 1,
          number: Number(num),
        }))
      : [];
    setSelected(updatedSelected);
  }, [searchParams]);

  useEffect(() => {
    if (!raffle.id) return;

    const fetchTakenTickets = async () => {
      try {
        const taken = await getPurchasedTickets(raffle.id ?? 0);
        setTakenTickets(taken);
      } catch (err) {
        console.error("Error fetching taken tickets:", err);
      }
    };

    fetchTakenTickets();
  }, [raffle.id]);

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
          raffle={formattedRaffle}
        />
      </div>
      <div className={styles.right}>
        <Raffle raffle={formattedRaffle} isSale total={total} hideBuyButton />
      </div>
    </div>
  );
}
