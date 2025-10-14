"use client";

import { HiArrowSmLeft } from "react-icons/hi";
import { useRouter } from "next/navigation";
import styles from "./BackButton.module.css";

interface BackButtonProps {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const BackButton = ({ className, onClick, children }: BackButtonProps) => {
  const router = useRouter();

  const handleBack = () => {
    onClick ? onClick() : router.back();
  };

  return (
    <button
      className={`${styles.backButton} ${className || ""}`}
      onClick={handleBack}
    >
      <HiArrowSmLeft
        className={styles.transLeft}
        style={{
          margin: "0 2px -4px -10px",
          fontSize: "20px",
        }}
      />
      {children || "Atrás"}
    </button>
  );
};

export default BackButton;
