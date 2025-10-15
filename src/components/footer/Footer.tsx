"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import Image from "next/image";
import Loader from "../loader/Loader";
import { useEffect, useState } from "react";
import { getFooterContact, getFooterSocialNetworks } from "@/lib/api/footer";
import { FooterContact, FooterSocialNetwork } from "@/types/footer";

export default function Footer() {
  const [socialNetworks, setSocialNetworks] = useState<FooterSocialNetwork[]>(
    []
  );
  const [contacts, setContacts] = useState<FooterContact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNetworks() {
      try {
        const data = await getFooterSocialNetworks();
        setSocialNetworks(data);
      } catch (err) {
        console.error("Error fetching footer social networks:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNetworks();
  }, []);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const { data } = await getFooterContact();
        setContacts(data);
      } catch (err) {
        console.error("Error fetching footer contacts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, []);

  if (loading) return <Loader />;
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
            <li>Email: {contacts?.email}</li>
            <li>Teléfono: {contacts?.phone}</li>
          </ul>
        </section>
      </div>

      <div className={`${styles.snWrapper}`}>
        <section className={styles.socialNetworks}>
          {socialNetworks.map((sn, i) => (
            <a
              key={i}
              className={styles.snLink}
              href={sn.url || "/"}
              target="_blank"
            >
              <Image
                src={sn.icon}
                alt={sn.alt || "icon"}
                width={30}
                height={30}
              />
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
