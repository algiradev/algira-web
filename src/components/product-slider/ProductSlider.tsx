"use client";

import Image from "next/image";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";
import styles from "./ProductSlider.module.css";

type Props = {
  images: string[];
  alt?: string;
  onSelect?: (img: string) => void;
};

export default function ProductSliderLightbox({
  images,
  alt,
  onSelect,
}: Props) {
  if (!images.length) return null;

  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.imageList}>
        {images.map((img, i) => (
          <div
            key={i}
            className={styles.imageItem}
            onClick={() => {
              if (onSelect) {
                onSelect(img);
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
        ))}
      </div>
    </div>
  );
}
