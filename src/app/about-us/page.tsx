"use client";

import { useEffect, useState } from "react";
import styles from "./AboutUs.module.css";
import { AboutUsItem, getAboutUs } from "@/lib/api/about-us";
import { Loader } from "lucide-react";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function AboutUs() {
  const [aboutUs, setAboutUs] = useState<AboutUsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const { data } = await getAboutUs();
        setAboutUs(data);
        console.log("aboutUs", data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, []);

  if (loading) <Loader />;

  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionContainer}>
        {aboutUs.map((section, index) => (
          <div
            key={section.id}
            className={`${styles.clip} ${styles[`clip${index + 1}`]}`}
            style={{ backgroundImage: `url(${STRAPI_URL}${section.img})` }}
          >
            <h2
              className={`${styles.clipTitle} ${styles[`clipTitle-${index}`]}`}
            >
              {section.title}
            </h2>
            <div className={styles.wrapperContent}>
              <div className={styles.content}>
                <h2 className={styles.contentTitle}>{section.title}</h2>
                <p className={styles.contentText}>{section.text}</p>
                <p className={styles.contentTitleShort}>{section.shortText}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
