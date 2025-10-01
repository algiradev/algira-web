"use client";
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import styles from "./SlotMachine.module.css";

interface SlotMachineProps {
  winningNumber: string; // "042" recibido desde la BD
  onFinished?: () => void; // función para llamar la animación del ticket
}

export default function SlotMachine({
  winningNumber,
  onFinished,
}: SlotMachineProps) {
  const reelRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const leverRef = useRef<HTMLDivElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Animar la palanca
    gsap.to(leverRef.current, {
      rotation: -45,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      transformOrigin: "top left",
    });

    reelRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const finalDigit = Number(winningNumber[i]);
      const digitHeight = 100;
      const spinCycles = 5;
      const distance = digitHeight * (10 * spinCycles + finalDigit);

      gsap.fromTo(
        ref.current,
        { y: 0 },
        {
          y: -distance,
          duration: 15 + i * 4,
          ease: "power4.out",
          onComplete: () => {
            if (i === 3) {
              setIsSpinning(false);
              // Espera 3 segundos y luego ejecuta la animación del ticket
              setTimeout(() => {
                if (typeof onFinished === "function") {
                  onFinished(); // llamar a la animación del ticket
                }
              }, 0);
            }
          },
        }
      );
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      spin();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.slotMachine}>
      {/* Ventana de los 3 dígitos */}
      <div className={styles.window}>
        {reelRefs.map((ref, i) => (
          <div key={i} className={styles.reel}>
            <div ref={ref} className={styles.innerReel}>
              {Array.from({ length: 60 }).map((_, n) => (
                <div key={n} className={styles.digit}>
                  {n % 10}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Palanca */}
      <div className={styles.lever} ref={leverRef}>
        <div className={styles.knob}></div>
      </div>
    </div>
  );
}
