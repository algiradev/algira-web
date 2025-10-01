import { useEffect, useState } from "react";

function useCountdown(targetDate: Date | null) {
  const [timeLeft, setTimeLeft] = useState<number>(-1);

  useEffect(() => {
    if (!targetDate || !targetDate.getTime || isNaN(targetDate.getTime())) {
      setTimeLeft(0);
      return;
    }

    const end = targetDate.getTime();
    const updateTimeLeft = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(diff);
    };

    updateTimeLeft(); // Ejecutar inmediatamente
    const interval = setInterval(updateTimeLeft, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [targetDate]);

  return timeLeft;
}

export default useCountdown;
