"use client";
import { MyRaffle } from "@/types/raffle";
import TicketsClient from "./TicketsClient";

export default function TicketsPageClient({ raffle }: { raffle: MyRaffle }) {
  return <TicketsClient raffle={raffle} />;
}
