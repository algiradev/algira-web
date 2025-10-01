import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export default function Celebration() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: Math.max(
          document.documentElement.clientHeight, // altura visible de la ventana
          window.innerHeight // altura de la ventana (fallback)
        ),
      });
    };

    window.addEventListener("scroll", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("scroll", handleResize);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed", // ocupa toda la pantalla
        top: -100,
        left: 0,
        // height: windowSize.height,
        pointerEvents: "none", // no bloquea clics
        zIndex: 9999,
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
