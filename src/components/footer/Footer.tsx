"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import Image from "next/image";

const socialNetworks = [
  {
    img: "/svg/instagram.svg",
    alt: "Instagram",
    href: "https://instagram.com",
  },
  {
    img: "/svg/whatsapp.svg",
    alt: "Facebook",
    href: "https://facebook.com",
  },
  {
    img: "/svg/facebook.svg",
    alt: "Facebook",
    href: "https://facebook.com",
  },
  {
    img: "/svg/tik-tok.svg",
    alt: "Facebook",
    href: "https://tik-tok.com",
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <section className={styles.col}>
          <h2 className={styles.h2}>Acerca de</h2>
          <ul className={styles.ul}>
            <li>
              <Link href="/about-us" className={styles.link}>
                Nosotros
              </Link>
            </li>
            <li>Términos y condiciones</li>
          </ul>
        </section>

        <section className={styles.col}>
          <h2 className={styles.h2}>Navegación</h2>
          <ul className={styles.ul}>
            <li>
              <Link href="/" className={styles.link}>
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/raffle-room" className={styles.link}>
                Sala de sorteos
              </Link>
            </li>
            <li>
              <Link href="/results" className={styles.link}>
                Sala de resultados
              </Link>
            </li>
          </ul>
        </section>

        <section className={styles.col}>
          <h2 className={styles.h2}>Contacto</h2>
          <ul className={styles.ul}>
            <li>Email: contacto@algira.com</li>
            <li>Teléfono: 097108878</li>
          </ul>
        </section>
      </div>

      <div className={`${styles.snWrapper}`}>
        <section className={styles.socialNetworks}>
          {socialNetworks.map((sn, i) => (
            <a key={i} className={styles.snLink} href={sn.href} target="_blank">
              <Image src={sn.img} alt={sn.alt} width={30} height={30} />
            </a>
          ))}
        </section>
      </div>

      <div className={styles.gridDevelsoft}>
        <section>
          <span>
            Powered by
            <a
              href="https://www.develsoft.dev/"
              target="_blank"
              className={styles.develsoftLink}
            >
              {" "}
              © Develsoft SAS
            </a>
          </span>
        </section>
      </div>
    </footer>
  );
}
