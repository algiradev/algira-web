import { getRaffleById } from "@/lib/api/raffle";
import TicketsClient from "./TicketsClient";
import { notFound } from "next/navigation";
import { PageProps } from "@/types/next";

export default async function TicketsPage({ params }: PageProps) {
  const { id } = await params;

  const raffleId = parseInt(id, 10);

  const raffle = await getRaffleById(raffleId);

  if (!raffle) {
    notFound();
  }

  return <TicketsClient raffle={raffle} />;
}
