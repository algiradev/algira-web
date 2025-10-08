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
    const timer = setTimeout(() => {
      setShowTicket(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [winnerNumber, winnerName]);

  useEffect(() => {
    if (showWinnerTicket) {
      setCelebrate(true);
    }
  }, [showWinnerTicket]);
  console.log("number", winnerNumber);

  return (
    <>
      <div
        style={{
          textAlign: "center",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <SlotMachine
            winningNumber={winnerNumber ?? "0000"}
            onFinished={() => setShowWinnerTicket(true)}
          />

          {showWinnerTicket && (
            <WinnerTicket
              name={winnerName ?? ""}
              number={winnerNumber ?? "0000"}
            />
          )}
        </div>
      </div>
      {celebrate && <Celebration />}
    </>
  );
}
