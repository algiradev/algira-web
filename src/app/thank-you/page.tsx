"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ThankYou.module.css";

export default function ThankYou() {
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setEmail(parsedUser.email || null);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }

    const timer = setTimeout(() => {
      router.push("/");
    }, 7000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.checkmark}>✓</div>
        <h1 className={styles.title}>¡Gracias por confiar en Algira!</h1>
        <p className={styles.subtitle}>
          Tu compra ha sido procesada correctamente.
          <br />
          <br />
          Hemos enviado un email a <strong>{email}</strong> con los detalles de
          tu compra
        </p>
        <p className={styles.redirect}>
          Serás redirigido a la página principal...
        </p>
      </div>
    </div>
  );
}
