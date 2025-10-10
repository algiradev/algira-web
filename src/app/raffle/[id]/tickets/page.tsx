import { getRaffleById } from "@/lib/api/raffle";
import { notFound } from "next/navigation";
import { PageProps } from "@/types/next";
import TicketsPageClient from "./TicketsPageClient";

export default async function TicketsPage({ params }: PageProps) {
  const raffleId = parseInt((await params).id, 10);
  const raffle = await getRaffleById(raffleId);

  if (!raffle) notFound();

  return <TicketsPageClient raffle={raffle} />;
}
