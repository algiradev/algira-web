"use client";

import { useEffect, useState } from "react";
import { getRaffles } from "../../lib/api/raffle";
import Loader from "../../components/loader/Loader";
import { MyRaffle } from "../../types/raffle";
import styles from "./HomePage.module.css";
import Raffle from "@/components/raffle/Raffle";
import { useSocket } from "@/providers/SocketProvider";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const sortRaffles = (rafflesList: MyRaffle[]) => {
  return [...rafflesList].sort((a, b) => {
    // 1️⃣ No sorteadas primero
    if (a.isDrawn !== b.isDrawn) {
      return a.isDrawn ? 1 : -1;
    }

    const aTime = new Date(a.endDate ?? 0).getTime();
    const bTime = new Date(b.endDate ?? 0).getTime();

    // 2️⃣ Si ambas NO están sorteadas → más próxima primero
    if (!a.isDrawn && !b.isDrawn) {
      if (isNaN(aTime) && isNaN(bTime)) return 0;
      if (isNaN(aTime)) return 1;
      if (isNaN(bTime)) return -1;
      return aTime - bTime; // ascendente
    }

    // 3️⃣ Si ambas están sorteadas → más reciente primero
    if (a.isDrawn && b.isDrawn) {
      if (isNaN(aTime) && isNaN(bTime)) return 0;
      if (isNaN(aTime)) return 1;
      if (isNaN(bTime)) return -1;
      return bTime - aTime; // descendente
    }

    return 0;
  });
};

const HomePage = () => {
  const [raffles, setRaffles] = useState<MyRaffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string>("");

  const { socket } = useSocket();

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const data = await getRaffles();

        const sortedRaffles = sortRaffles(data);
        setRaffles(sortedRaffles);
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
      setRaffles((prev) => {
        const updated = prev.map((r) =>
          r.id === raffleId ? { ...r, availableAmount } : r
        );
        return sortRaffles(updated);
      });
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
    <div className={styles.container}>
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
    </div>
  );
};

export default HomePage;
