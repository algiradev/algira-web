"use client";
import { MyRaffle } from "@/types/raffle";
import SlotMachine from "./SlotMachine";
import WinnerTicket from "./WinnerTicket";
import { useEffect, useState } from "react";
import Celebration from "../celebration/Celebration";

type Props = {
  raffle: MyRaffle;
  countdown?: number;
  winnerNumber?: string;
  winnerName?: string;
};

export default function RaffleDrawUI({
  raffle,
  countdown,
  winnerNumber,
  winnerName,
}: Props) {
  const [showTicket, setShowTicket] = useState(false);
  const [showWinnerTicket, setShowWinnerTicket] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    // if (winnerNumber && winnerName) {
    // Esperar 3 segundos después de que se revele el número
    const timer = setTimeout(() => {
      setShowTicket(true);
    }, 500);

    return () => clearTimeout(timer);
    // }
  }, [winnerNumber, winnerName]);

  // Cuando el ticket aparece → activar celebración
  useEffect(() => {
    if (showWinnerTicket) {
      setCelebrate(true);
      // apaga confetti después de 8s
      // const t = setTimeout(() => setCelebrate(false), 8000);
      // return () => clearTimeout(t);
    }
  }, [showWinnerTicket]);

  return (
    <>
      <div
        style={{
          textAlign: "center",
          // width: "100%",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <SlotMachine
            winningNumber={winnerNumber ?? "000"}
            onFinished={() => setShowWinnerTicket(true)}
          />

          {showWinnerTicket && (
            <WinnerTicket
              name={winnerName ?? ""}
              number={winnerNumber ?? "000"}
            />
          )}
        </div>
      </div>
      {celebrate && <Celebration />}
    </>
  );
}
