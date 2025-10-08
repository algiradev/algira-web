"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import styles from "./ToTop.module.css";
import { ArrowUpToLine } from "lucide-react";

const ToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const scrollToTop = (): void => {
    const start = window.scrollY;
    const duration = 700;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(0, start - start * ease);

      if (progress < 1) requestAnimationFrame(animateScroll);
    };

    requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <Link
      href=""
      className={`${styles.scrollToTop}  ${isVisible ? styles.show : ""}`}
      onClick={scrollToTop}
    >
      <ArrowUpToLine className={styles.icon} />
    </Link>
  );
};

export default ToTop;
