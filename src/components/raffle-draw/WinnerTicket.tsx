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
    () => ["75%", "110%", "140%", "180%", "185%", "0%", "-15%", "0%"],
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
    const keyframeIndexForZ = yKeyframes.findIndex((y) => y === "185%");
    const timeUntilZ = delay / 1000 + durationPerKeyframe * keyframeIndexForZ;

    const timer = setTimeout(() => setZIndex(1), timeUntilZ * 1000);
    return () => clearTimeout(timer);
  }, [delay, yKeyframes]);

  return (
    <motion.div
      className={styles.ticketWrapper}
      style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        x: "-50%",
        overflow: "hidden",
        height: 100,
        width: 250,
        zIndex,
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
