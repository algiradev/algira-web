"use client";

import { useEffect, useState } from "react";
import { getRaffles } from "../../lib/api/raffle";
import Loader from "../../components/loader/Loader";
import { MyRaffle } from "../../types/raffle";
import styles from "./Raffleroom.module.css";
import Raffle from "@/components/raffle/Raffle";
import { io } from "socket.io-client";
import { useSocket } from "@/providers/SocketProvider";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const RaffleRoom = () => {
  const [raffles, setRaffles] = useState<MyRaffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string>("");

  const { socket } = useSocket();

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const data = await getRaffles();
        setRaffles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRaffles();

    setUser(localStorage.getItem("user") ?? "");
  }, []);

  // Suscribirse a actualizaciones de rifas
  useEffect(() => {
    if (!socket) return;

    const handleRaffleUpdate = ({
      raffleId,
      availableAmount,
    }: {
      raffleId: number;
      availableAmount: number;
    }) => {
      setRaffles((prev) =>
        prev.map((r) => (r.id === raffleId ? { ...r, availableAmount } : r))
      );
    };

    socket.on("raffle:update", handleRaffleUpdate);

    return () => {
      socket.off("raffle:update", handleRaffleUpdate);
    };
  }, [socket]);

  if (loading) return <Loader />;
  if (raffles.length === 0)
    return <p className={styles.noRaffles}>No hay rifas disponibles</p>;

  return (
    <div className={styles.raffleRoom}>
      {raffles.map((raffle) => {
        const formattedRaffle = {
          id: raffle.id ?? 0,
          endDate: raffle.endDate ?? new Date().toISOString(),
          price: raffle.price ?? 0,
          availableAmount: raffle.availableAmount ?? 0,
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

        return (
          <Raffle
            key={raffle.id ?? Math.random()}
            raffle={formattedRaffle}
            isSale={true}
            user={!!user}
          />
        );
      })}
    </div>
  );
};

export default RaffleRoom;
