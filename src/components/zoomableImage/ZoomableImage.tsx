"use client";

import React, { useRef, useState } from "react";
import styles from "./ZoomableImage.module.css";

type Props = {
  src: string;
  zoomSrc?: string;
  alt?: string;
  zoomScale?: number; // ejemplo 2.5
  zoomWidth?: number; // ancho del panel de zoom (px)
  zoomHeight?: number; // alto del panel de zoom (px)
};

export default function ZoomableImage({
  src,
  zoomSrc,
  alt = "Imagen del producto",
  zoomScale = 2.5,
  zoomWidth = 500,
  zoomHeight = 500,
}: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const zoomRef = useRef<HTMLDivElement | null>(null);

  const [isZooming, setIsZooming] = useState(false);
  const [lens, setLens] = useState({ left: 0, top: 0, size: 0 });
  const [zoomImgStyle, setZoomImgStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const imgRect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - imgRect.left; // px dentro de la imagen visible
    const y = e.clientY - imgRect.top;

    // si sale del área, no zoom
    if (x < 0 || y < 0 || x > imgRect.width || y > imgRect.height) {
      setIsZooming(false);
      return;
    }
    setIsZooming(true);

    // dimensiones de la imagen zoomeada (en px)
    const zoomedWidth = imgRect.width * zoomScale;
    const zoomedHeight = imgRect.height * zoomScale;

    // centro del panel de zoom (px)
    const zW = zoomRef.current ? zoomRef.current.clientWidth : zoomWidth;
    const zH = zoomRef.current ? zoomRef.current.clientHeight : zoomHeight;

    // calcular posición para centrar el punto bajo el cursor
    let left = -(x * zoomScale - zW / 2);
    let top = -(y * zoomScale - zH / 2);

    // acotar para que la imagen zoomeada cubra todo el panel (no deje huecos)
    const minLeft = zW - zoomedWidth; // negativo o 0
    const maxLeft = 0;
    left = Math.min(maxLeft, Math.max(minLeft, left));

    const minTop = zH - zoomedHeight;
    const maxTop = 0;
    top = Math.min(maxTop, Math.max(minTop, top));

    setZoomImgStyle({
      left,
      top,
      width: zoomedWidth,
      height: zoomedHeight,
    });

    // calcular tamaño y posición del lente (cuadro sobre la imagen original)
    // el área de la imagen que cabe en el panel de zoom corresponde a:
    // lensSize = panelWidth / zoomScale
    const lensSize = zW / zoomScale;

    let lensLeft = x - lensSize / 2;
    let lensTop = y - lensSize / 2;

    // acotar lente dentro de la imagen original
    lensLeft = Math.max(0, Math.min(lensLeft, imgRect.width - lensSize));
    lensTop = Math.max(0, Math.min(lensTop, imgRect.height - lensSize));

    setLens({ left: lensLeft, top: lensTop, size: lensSize });
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.imageWrapper}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={styles.productImage}
          draggable={false}
        />

        {/* lente (cuadro) */}
        {isZooming && (
          <div
            className={styles.lens}
            style={{
              left: `${lens.left}px`,
              top: `${lens.top}px`,
              width: `${lens.size}px`,
              height: `${lens.size}px`,
            }}
          />
        )}
      </div>

      {/* panel de zoom */}
      {isZooming && (
        <div
          ref={zoomRef}
          className={styles.zoomContainer}
          // style={{ width: `${zoomWidth}px`, height: `${zoomHeight}px` }}
        >
          <img
            src={zoomSrc ?? src}
            alt={alt}
            className={styles.zoomedImage}
            style={{
              left: `${zoomImgStyle.left}px`,
              top: `${zoomImgStyle.top}px`,
              width: `${zoomImgStyle.width}px`,
              height: `${zoomImgStyle.height}px`,
            }}
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
