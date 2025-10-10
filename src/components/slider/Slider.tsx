"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./Slider.module.css";
import { getSlides, SliderItem } from "@/lib/api/slider";
import Image from "next/image";
import Loader from "../loader/Loader";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export default function Slider() {
  const [slides, setSlides] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await getSlides();
        setSlides(data);
      } catch (err) {
        console.error("Error fetching slides:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <Loader />;
  if (!slides.length) return <p>No hay slides disponibles.</p>;

  return (
    <div className={styles.sliderWrapper}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
      >
        {slides.map((slide) => {
          const imageToShow =
            windowWidth < 700 && slide.imgSmall ? slide.imgSmall : slide.img;

          return (
            <SwiperSlide key={slide.id}>
              <div className={styles.slide}>
                <Image
                  src={`${STRAPI_URL}${imageToShow!}`}
                  alt={slide.alt}
                  width={1200}
                  height={600}
                  className={styles.img}
                />
                {slide.title && <h2 className={styles.title}>{slide.title}</h2>}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
