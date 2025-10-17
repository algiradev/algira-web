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
  hasTickets,
  winnerName,
  initialPhase = "enter",
  replayTrigger = 0,
  onAnimationEnd,
}: {
  raffle: MyRaffle;
  onExit: () => void;
  slotMachine?: React.ReactNode;
  hasTickets?: boolean;
  winnerName?: string;
  initialPhase?: "enter" | "right";
  replayTrigger?: number;
  onAnimationEnd?: () => void;
}) {
  const [phase, setPhase] = useState<"enter" | "right">(initialPhase);

  useEffect(() => {
    setPhase("enter");
    const t = setTimeout(() => {
      setPhase("enter");
    }, 10);
    return () => clearTimeout(t);
  }, [replayTrigger]);

  useEffect(() => {
    if (phase === "enter") {
      const t = setTimeout(() => setPhase("right"), 2000);
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
        zIndex: "2000",
      }}
    >
      <motion.div
        key={`${raffle.id}-${replayTrigger}`}
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
          if (phase === "right") {
            if (onAnimationEnd) onAnimationEnd();
            const time = setTimeout(() => {
              onExit();
            }, 500);
            return () => clearTimeout(time);
          }
        }}
        style={{ pointerEvents: "none" }}
      >
        <Raffle raffle={raffle} isSale={false} user={false} hideBuyButton />
      </motion.div>

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
        {hasTickets && slotMachine}
        {!hasTickets && (
          <p className="text-xl text-gray-700">
            {winnerName ||
              "No se realizará el sorteo porque no se vendió el mínimo de tickets para esta rifa."}
          </p>
        )}
      </div>
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

  const [raffleHasTickets, setRaffleHasTickets] = useState(true);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [showNoTicketsMessage, setShowNoTicketsMessage] = useState(false);
  const [showReplayButton, setShowReplayButton] = useState(false);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const { socket } = useSocket();

  const [replayTrigger, setReplayTrigger] = useState(0);

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

  // Check localStorage on mount
  useEffect(() => {
    const drawState = localStorage.getItem("drawState");
    if (drawState) {
      const parsed = JSON.parse(drawState);
      const { drawTime, raffle, winnerNumber, winnerName, hasTickets } = parsed;
      const elapsed = Date.now() - drawTime;
      const tenMinutes = 10 * 60 * 1000;

      if (elapsed < tenMinutes) {
        // Restore state
        setMovedRaffle(raffle);
        setWinnerNumber(winnerNumber);
        setWinnerName(winnerName);
        setRaffleHasTickets(hasTickets);
        if (hasTickets) {
          setShowDraw(true);
        } else {
          setShowNoTicketsMessage(true);
        }

        // Adjust raffles: set isDrawn false for this raffle
        setRaffles((prev) => {
          const newPrev = [...prev];
          const index = newPrev.findIndex((r) => r.id === raffle.id);
          if (index !== -1) {
            newPrev[index].isDrawn = false;
          }
          return sortRaffles(newPrev);
        });

        // Set timeout for remaining time
        const remaining = tenMinutes - elapsed;
        setTimeout(resetDrawState, remaining);
      } else {
        localStorage.removeItem("drawState");
      }
    }
  }, []);

  // Reset function
  const resetDrawState = () => {
    localStorage.removeItem("drawState");
    if (movedRaffle) {
      setRaffles((prev) =>
        sortRaffles(prev.filter((r) => r.id !== movedRaffle.id))
      );
    }
    setMovedRaffle(null);
    setShowDraw(false);
    setWinnerNumber("");
    setWinnerName("");
    setShowNoTicketsMessage(false);
    setShowCountdown(true);
  };

  // Trigger hero animation on countdown finish
  const triggerRaffleDraw = () => {
    if (raffles.length === 0) return;
    setMovedRaffle(raffles[0]);
  };

  // Countdown finish → activar animación
  const handleCountdownFinish = () => {
    if (raffles.length > 0) {
      setShowCountdown(false);
      triggerRaffleDraw();
    }
  };

  // Socket para recibir ganador en tiempo real
  useEffect(() => {
    if (!socket) return;

    const handleRaffleDraw = (data: {
      raffleId: number;
      ticketNumber?: string | number;
      userName?: string;
      userEmail?: string;
      noTickets?: boolean;
      message?: string;
    }) => {
      const raffleIdNum = Number(data.raffleId);

      // Encontrar la rifa sorteada
      const drawnRaffle = raffles.find((r) => r.id === raffleIdNum);
      if (!drawnRaffle) return;

      const hasTickets = !data.noTickets;

      setMovedRaffle(drawnRaffle);
      setRaffleHasTickets(hasTickets);

      if (hasTickets) {
        // 🏆 Caso: hay ganador
        setWinnerNumber(data.ticketNumber?.toString() ?? "");
        setWinnerName(data.userName ?? "Ganador desconocido");
      } else {
        // ⚠️ Caso: no hubo tickets o sorteo incompleto
        setWinnerNumber("");
        setWinnerName(
          data.message ??
            "No se realizará el sorteo porque no se vendieron tickets."
        );
      }

      // Store in localStorage
      const drawState = {
        drawTime: Date.now(),
        raffle: drawnRaffle,
        winnerNumber: data.ticketNumber?.toString() ?? "",
        winnerName: data.userName ?? "Ganador desconocido",
        hasTickets,
      };
      localStorage.setItem("drawState", JSON.stringify(drawState));

      // Set 10 min timeout
      setTimeout(resetDrawState, 10 * 60 * 1000);
    };

    socket.on("raffle:draw", handleRaffleDraw);
    return () => {
      socket.off("raffle:draw", handleRaffleDraw);
    };
  }, [socket, raffles]);

  useEffect(() => {
    if (!socket) return;

    socket.on("raffle:created", (raffle) => {
      setRaffles((prev) => sortRaffles([...prev, raffle])); // actualizar estado
    });

    return () => {
      socket.off("raffle:created");
    };
  }, [socket]);

  const handleReplay = () => {
    setShowDraw(false);
    setShowNoTicketsMessage(false);
    setReplayTrigger((prev) => prev + 1);
  };

  const handleHeroExit = () => {
    if (raffleHasTickets) {
      setShowDraw(true);
    } else {
      setShowNoTicketsMessage(true);
    }
  };

  const upcomingRaffles = raffles.filter(
    (r) => new Date(r.endDate as string).getTime() > Date.now()
  );

  useEffect(() => {
    if (!movedRaffle) return;

    const drawState = localStorage.getItem("drawState");
    if (!drawState) return;

    const { drawTime } = JSON.parse(drawState);
    const elapsed = Date.now() - drawTime;
    const tenMinutes = 10 * 60 * 1000;

    if (elapsed >= tenMinutes) return; // ya pasó el tiempo

    // Inicializar contador
    setTimeLeft(tenMinutes - elapsed);

    // Mostrar botón tras animación
    const showButtonTimeout = setTimeout(
      () => setShowReplayButton(true),
      35000
    );

    // Intervalo para actualizar contador cada segundo
    const interval = setInterval(() => {
      const remaining = tenMinutes - (Date.now() - drawTime);
      if (remaining <= 0) {
        setTimeLeft(0);
        setShowReplayButton(false);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => {
      clearTimeout(showButtonTimeout);
      clearInterval(interval);
    };
  }, [movedRaffle]);

  if (loading) return <Loader />;

  return (
    <div className={styles.container}>
      {/* HERO */}
      <section className={styles.hero} style={{ minHeight: "400px" }}>
        {(!movedRaffle && !showDraw) || showCountdown ? (
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
        ) : null}

        {movedRaffle && (
          <HeroRaffle
            raffle={movedRaffle}
            onExit={handleHeroExit}
            initialPhase={showDraw || showNoTicketsMessage ? "right" : "enter"}
            replayTrigger={replayTrigger}
            hasTickets={raffleHasTickets}
            slotMachine={
              showDraw
                ? winnerNumber && (
                    <motion.div
                      initial={{ y: -500, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 12,
                      }}
                    >
                      <RaffleDrawUI
                        raffle={movedRaffle}
                        winnerNumber={winnerNumber.padStart(4, "0")}
                        winnerName={winnerName}
                      />
                    </motion.div>
                  )
                : showNoTicketsMessage && (
                    <div className="no-tickets-message text-center mt-8">
                      <p className="text-xl text-gray-700">{winnerName}</p>
                    </div>
                  )
            }
            winnerName={showNoTicketsMessage ? winnerName : undefined}
            onAnimationEnd={() => {
              setTimeout(() => {
                setShowReplayButton(true);
              }, 35000);
            }}
          />
        )}

        {movedRaffle && showReplayButton && (
          <button
            onClick={() => {
              setShowReplayButton(false);
              handleReplay();
            }}
            className={styles.replayButton}
          >
            Ver sorteo de nuevo
            {timeLeft !== null && (
              <span>
                {`${Math.floor(timeLeft / 60000)
                  .toString()
                  .padStart(2, "0")}:${Math.floor((timeLeft % 60000) / 1000)
                  .toString()
                  .padStart(2, "0")}`}
              </span>
            )}
          </button>
        )}
      </section>

      {/* Lista de rifas */}
      <section className={styles.raffleList}>
        <h2 className={styles.raffleListTitle}>Próximas rifas</h2>
        <div className={styles.rafflesGrid}>
          <AnimatePresence>
            {raffles
              .filter((r) => !r.isDrawn)
              .map((raffle, idx) => (
                <motion.div
                  key={raffle.id}
                  layout
                  initial={{ scale: 0 }}
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
