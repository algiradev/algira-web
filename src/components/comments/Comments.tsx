"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import Image from "next/image";
import styles from "./Comments.module.css";
import { useEffect, useState } from "react";
import { CommentItem, getComments } from "@/lib/api/comment";
import Loader from "../loader/Loader";

export default function Comments() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const { data } = await getComments();
        setComments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, []);

  if (loading) return <Loader />;

  return (
    <section className={styles.comments}>
      <h2 className={styles.title}>¡Ganadores Felices!</h2>

      <Swiper
        className={styles.swiper}
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {comments.map((c) => (
          <SwiperSlide key={c.id}>
            <div className={styles.card}>
              {c.img && (
                <Image
                  src={`${c.img}`}
                  alt={c.name}
                  width={80}
                  height={80}
                  className={styles.avatar}
                />
              )}
              <h3 className={styles.name}>{c.name}</h3>
              <p className={styles.text}>{`${c.comment}`}</p>
              <div className={styles.stars}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={
                      i < c.rating ? styles.starFilled : styles.starEmpty
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
