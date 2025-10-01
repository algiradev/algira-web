"use client";

import { useEffect, useRef, useState } from "react";
import { getRaffles } from "@/lib/api/raffle";
import Loader from "@/components/loader/Loader";
import Raffle from "@/components/raffle/Raffle";
import { MyRaffle } from "@/types/raffle";
import styles from "./Raffleroom.module.css";
import { AnimatePresence, motion } from "framer-motion";
import RaffleDrawUI from "@/components/raffle-draw/RaffleDrawUI";
import NextRaffleCountdown from "@/components/raffle-countdown/NextRaffleCountdown";
import { useSocket } from "@/providers/SocketProvider";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function HeroRaffle({
  raffle,
  onExit,
  slotMachine,
}: {
  raffle: MyRaffle;
  onExit: () => void;
  slotMachine?: React.ReactNode;
}) {
  const [phase, setPhase] = useState<"enter" | "right" | "done">("enter");

  useEffect(() => {
    if (phase === "enter") {
      const t = setTimeout(() => setPhase("right"), 1000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "600px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <motion.div
        key={raffle.id}
        className={styles.heroRaffle}
        initial={{ x: -1000, scale: 0, rotate: 0 }}
        animate={
          phase === "enter"
            ? { x: 0, scale: 1, rotate: 360 }
            : phase === "right"
            ? { x: 500, scale: 1, rotate: 360 }
            : {}
        }
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        onAnimationComplete={() => {
          if (phase === "right") onExit();
        }}
        style={{ pointerEvents: "none" }}
      >
        <Raffle raffle={raffle} isSale={false} user={false} hideBuyButton />
      </motion.div>

      {slotMachine && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
          }}
        >
          {slotMachine}
        </div>
      )}
    </div>
  );
}

const RaffleRoom = () => {
  const [raffles, setRaffles] = useState<MyRaffle[]>([]);
  const [loading, setLoading] = useState(true);

  const [movedRaffle, setMovedRaffle] = useState<MyRaffle | null>(null);
  const [showDraw, setShowDraw] = useState(false);
  const [winnerNumber, setWinnerNumber] = useState<string>("");
  const [winnerName, setWinnerName] = useState<string>("");

  const firstRaffleRef = useRef<HTMLDivElement>(null);

  const { socket } = useSocket();

  const formatRaffle = (raffle: MyRaffle) => ({
    id: raffle.id ?? 0,
    endDate: raffle.endDate ?? new Date().toISOString(),
    price: raffle.price ?? 0,
    availableAmount: raffle.availableAmount ?? 0,
    isDrawn: raffle.isDrawn ?? false,
    product: {
      id: raffle.product?.id ?? 0,
      title: raffle.title ?? "",
      shortDescription: raffle.product?.shortDescription ?? "",
      description: raffle.product?.description ?? "",
      image:
        raffle.product?.image?.map((img: string) =>
          img.startsWith("http") ? img : STRAPI_URL + img
        ) ?? [],
    },
  });

  const sortRaffles = (rafflesList: MyRaffle[]) => {
    const now = Date.now();
    return [...rafflesList].sort((a, b) => {
      if (a.isDrawn && !b.isDrawn) return 1;
      if (!a.isDrawn && b.isDrawn) return -1;
      const aTime = new Date(a.endDate as string).getTime();
      const bTime = new Date(b.endDate as string).getTime();
      return aTime - bTime;
    });
  };

  // Fetch rifas inicial
  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const data = await getRaffles();
        const formatted = data.map(formatRaffle);

        setRaffles(sortRaffles(formatted));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRaffles();
  }, []);

  // Animación salida primera rifa
  const triggerRaffleDraw = () => {
    if (raffles.length === 0) return;

    const raffleEl = firstRaffleRef.current;
    if (!raffleEl) return;

    const rect = raffleEl.getBoundingClientRect();
    const clone = raffleEl.cloneNode(true) as HTMLElement;
    document.body.appendChild(clone);
    Object.assign(clone.style, {
      position: "fixed",
      top: rect.top + "px",
      left: rect.left + "px",
      width: rect.width + "px",
      zIndex: "9999",
      margin: "0",
    });

    raffleEl.style.opacity = "0";

    const anim = clone.animate(
      [
        { opacity: 1, transform: "scale(1)" },
        { opacity: 0, transform: "scale(0)" },
      ],
      { duration: 400, easing: "ease-in-out", fill: "forwards" }
    );

    anim.onfinish = () => {
      const raffleToMove = raffles[0];

      // Movemos la rifa original al final de la lista **antes de mostrarla**
      setRaffles((prev) => [...prev.slice(1), raffleToMove]);

      // Animamos su aparición con scale y opacity
      requestAnimationFrame(() => {
        if (firstRaffleRef.current) {
          firstRaffleRef.current.animate(
            [
              { opacity: 0, transform: "scale(0)" },
              { opacity: 1, transform: "scale(1)" },
            ],
            { duration: 400, easing: "ease-in-out", fill: "forwards" }
          );
        }
      });

      setMovedRaffle(raffleToMove);
      clone.remove();
    };
  };

  // Countdown finish → activar animación
  const handleCountdownFinish = () => {
    if (raffles.length > 0) {
      triggerRaffleDraw();
    }
  };

  // Socket para recibir ganador en tiempo real
  useEffect(() => {
    if (!socket) return;

    const handleRaffleDraw = (data: {
      raffleId: number;
      ticketNumber: string;
      userName: string;
    }) => {
      const raffleIdNum = Number(data.raffleId);
      const raffle = raffles.find((r) => r.id === raffleIdNum);

      if (raffle) {
        setMovedRaffle(raffle);
        setWinnerNumber(data.ticketNumber.toString());
        setWinnerName(data.userName);
        setShowDraw(true);
      }
    };

    socket.on("raffle:draw", handleRaffleDraw);
    return () => {
      socket.off("raffle:draw", handleRaffleDraw);
    };
  }, [socket, raffles]);

  useEffect(() => {
    if (!socket) return;

    socket.on("raffle:created", (raffle) => {
      console.log("Nueva rifa creada:", raffle);
      setRaffles((prev) => [...prev, raffle]); // actualizar estado
    });

    return () => {
      socket.off("raffle:created");
    };
  }, [socket]);

  // Cuando termina slot machine -> reiniciar hero
  useEffect(() => {
    if (!showDraw) return;
    const timer = setTimeout(() => {
      setShowDraw(false);
      setMovedRaffle(null);
      setWinnerNumber("");
      setWinnerName("");
    }, 5 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [showDraw]);

  const upcomingRaffles = raffles.filter(
    (r) => new Date(r.endDate as string).getTime() > Date.now()
  );

  if (loading) return <Loader />;

  return (
    <div className={styles.container}>
      {/* HERO */}
      <section className={styles.hero} style={{ minHeight: "400px" }}>
        {!movedRaffle && !showDraw && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            {upcomingRaffles.length > 0 ? (
              <NextRaffleCountdown
                targetDate={new Date(upcomingRaffles[0].endDate as string)}
                onFinish={handleCountdownFinish}
              />
            ) : (
              <p>Todas las rifas han sido sorteadas</p>
            )}
          </div>
        )}

        {movedRaffle && (
          <HeroRaffle
            raffle={movedRaffle}
            onExit={() => {
              setShowDraw(true);
            }}
            slotMachine={
              showDraw ? (
                <motion.div
                  initial={{ y: -500, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 12 }}
                >
                  <RaffleDrawUI
                    raffle={movedRaffle}
                    winnerNumber={winnerNumber.padStart(4, "0")}
                    winnerName={winnerName}
                  />
                </motion.div>
              ) : null
            }
          />
        )}
      </section>

      {/* Lista de rifas */}
      <section className={styles.raffleList}>
        <h2 className={styles.raffleListTitle}>Próximas rifas</h2>
        <div className={styles.rafflesGrid}>
          <AnimatePresence>
            {raffles.map((raffle, idx) => (
              <motion.div
                key={raffle.id}
                layout
                ref={idx === 0 ? firstRaffleRef : null}
                initial={{ scale: raffle.isDrawn ? 0 : 1 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Raffle raffle={raffle} isSale user />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default RaffleRoom;
