"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import styles from "./WinnerTicket.module.css";

interface WinnerTicketProps {
  name: string;
  number: string;
  delay?: number; // ms
}

export default function WinnerTicket({
  name,
  number,
  delay = 3000,
}: WinnerTicketProps) {
  const [zIndex, setZIndex] = useState(-1);

  // Keyframes de Y (efecto impresora + rebote)
  const yKeyframes = useMemo(
    () => [
      "-40%",
      "-20%",
      "0%",
      "20%",
      "40%",
      "50%",
      "70%",
      "90%", // aquí cambiaremos zIndex
      "100%",
      "-20%",
      "-25%",
      "-20%",
    ],
    []
  );

  // Distribución de tiempos para cada keyframe
  const times = useMemo(
    () => yKeyframes.map((_, i) => i / (yKeyframes.length - 1)),
    [yKeyframes]
  );

  useEffect(() => {
    // Calculamos el tiempo en segundos hasta el keyframe 90%
    const durationPerKeyframe = 0.3; // 0.3s por keyframe
    const keyframeIndexForZ = yKeyframes.findIndex((y) => y === "100%");
    const timeUntilZ = delay / 1000 + durationPerKeyframe * keyframeIndexForZ;

    const timer = setTimeout(() => setZIndex(1), timeUntilZ * 1000);
    return () => clearTimeout(timer);
  }, [delay, yKeyframes]);

  return (
    <motion.div
      className={styles.ticketWrapper}
      style={{
        width: 150,
        height: 200,
        position: "absolute",
        top: "40%",
        left: "50%",
        x: "-50%",
        zIndex: zIndex,
        overflow: "hidden",
      }}
      initial={{ y: yKeyframes[0] }}
      animate={{ y: yKeyframes }}
      transition={{
        delay: delay / 1000,
        duration: yKeyframes.length * 0.3,
        times: times,
        ease: Array(yKeyframes.length).fill("easeOut"),
      }}
    >
      <div className={styles.ticket}>
        <div className={styles.ticketContent}>
          🎉 Ganador: <span className={styles.name}>{name}</span>
          <br />
          Ticket: <span className={styles.number}>{number}</span>
        </div>
      </div>
    </motion.div>
  );
}
