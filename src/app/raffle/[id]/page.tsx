import RaffleDetailContainer from "@/components/raffle/RaffleDetailContainer";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default function RaffleDetailPage({ params }: Props) {
  const { id } = params;

  if (!id) return notFound();

  return <RaffleDetailContainer raffleId={parseInt(id, 10)} />;
}
