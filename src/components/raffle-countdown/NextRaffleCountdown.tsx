import formatTime from "@/utils/formatTime";
import useCountdown from "@/utils/useCountdown";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./NextRaffleCountdown.module.css";

export default function NextRaffleCountdown({
  targetDate,
  onFinish,
}: {
  targetDate: Date | null;
  onFinish?: () => void;
}) {
  const timeLeft = useCountdown(targetDate);
  const { days, hours, minutes, seconds } = formatTime(
    timeLeft >= 0 ? timeLeft : 0
  );
  const [hasFinished, setHasFinished] = useState(false);

  // Restablecer hasFinished cuando targetDate cambia
  useEffect(() => {
    setHasFinished(false);
  }, [targetDate]);

  // Ejecutar onFinish solo una vez cuando timeLeft llega a 0
  useEffect(() => {
    if (timeLeft === 0 && onFinish && !hasFinished) {
      onFinish();
      setHasFinished(true);
    }
  }, [timeLeft, onFinish, hasFinished]);

  // Validar targetDate o timeLeft no inicializado
  if (
    !targetDate ||
    !targetDate.getTime ||
    isNaN(targetDate.getTime()) ||
    timeLeft === -1
  ) {
    return <p>Fecha inválida para el sorteo</p>;
  }

  if (timeLeft === 0) {
    return <p>¡El sorteo está comenzando!</p>;
  }

  if (timeLeft <= 60) {
    const color = timeLeft <= 10 ? "red" : "yellow";
    return (
      <motion.h1
        style={{ fontSize: "4rem", fontWeight: "bold", color }}
        animate={timeLeft <= 10 ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 1, repeat: timeLeft <= 10 ? Infinity : 0 }}
      >
        {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
        {String(timeLeft % 60).padStart(2, "0")}
      </motion.h1>
    );
  }

  return (
    <h2 className={styles.text}>
      Faltan {days} días
      <br />
      {hours} horas
      <br /> {minutes} minutos
      <br /> {seconds} segundos
      <br />
      para el próximo sorteo
    </h2>
  );
}
