import RaffleDetailContainer from "@/components/raffle/RaffleDetailContainer";
import { PageProps } from "@/types/next";
import { notFound } from "next/navigation";

export default async function RaffleDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) return notFound();

  return <RaffleDetailContainer raffleId={parseInt(id, 10)} />;
}
