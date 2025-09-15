import { getRaffleById } from "@/lib/api/raffle";
import TicketsClient from "./TicketsClient";
import { notFound } from "next/navigation";

type Props = {
  params: { id: number };
};

export default async function TicketsPage({ params }: Props) {
  const { id } = params;

  const raffle = await getRaffleById(id);

  if (!raffle) {
    notFound();
  }

  return <TicketsClient raffle={raffle} />;
}
