"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";
import styles from "./ProductSlider.module.css";

type Props = {
  images: string[];
  alt?: string;
  onSelect?: (img: string, i: number) => void;
};

export default function ProductSliderLightbox({
  images,
  alt,
  onSelect,
}: Props) {
  if (!images.length) return null;

  return (
    <div className={styles.sliderWrapper}>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={4}
        navigation
        className={styles.imageList}
        breakpoints={{
          300: { slidesPerView: 3 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1450: { slidesPerView: 5 },
        }}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div
              className={styles.imageItem}
              onClick={() => {
                if (onSelect) {
                  onSelect(img, i);
                }
              }}
            >
              <Image
                src={img}
                alt={alt ?? `Imagen ${i + 1}`}
                width={120}
                height={120}
                className={styles.imageThumb}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
