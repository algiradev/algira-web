"use client";

import { useEffect, useState } from "react";

import RaffleDetail from "./RaffleDetail";
import Loader from "../loader/Loader";
import { getRaffleById } from "../../lib/api/raffle";
import { MyRaffle } from "@/types/raffle";

type Props = {
  raffleId: number;
};

export default function RaffleDetailContainer({ raffleId }: Props) {
  const [raffle, setRaffle] = useState<MyRaffle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        const data = await getRaffleById(raffleId);
        console.log(data);
        setRaffle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRaffle();
  }, [raffleId]);

  if (loading) return <Loader />;
  if (!raffle) return <div>Rifa no encontrada</div>;

  return <RaffleDetail raffle={raffle} />;
}
