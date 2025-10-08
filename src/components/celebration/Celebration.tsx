import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import styles from "./Celebration.module.css";

export default function Celebration() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: Math.max(
          document.documentElement.clientHeight,
          window.innerHeight
        ),
      });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const topValue = windowSize.width <= 770 ? -110 : -100;

  return (
    <div
      className={styles.celebration}
      style={{
        position: "fixed",
        top: topValue,
        left: 0,
      }}
    >
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle
        numberOfPieces={500}
      />
    </div>
  );
}
