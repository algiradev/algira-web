import { useMemo, useState } from "react";

import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import ZoomableImage from "../../components/zoomableImage/ZoomableImage";
import Button from "../../components/button/Button";
import BackButton from "../../components/button/BackButton";

// Importar tus tipos
import type { MyRaffle } from "../../types/raffle";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";
import styles from "./RaffleDetail.module.css";
import Link from "next/link";
import { useCart } from "@/context/useCart";

type Props = {
  raffle: MyRaffle;
};

const RaffleDetail = ({ raffle }: Props) => {
  const [index, setIndex] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);

  const { cart } = useCart();

  const quantityAvailable = raffle.availableAmount ?? 0;

  const today = new Date();
  const endDate = new Date(raffle.endDate ?? "");
  const isFinished = endDate < today;

  const ticketsInCart = useMemo(() => {
    const item = cart.find((c) => c.raffleId === raffle.id);
    return item ? item.tickets.map((t) => t.number).join(",") : "";
  }, [cart, raffle.id]);

  return (
    <section className={styles.raffle}>
      <div className={styles.backButtonWrapper}>
        <BackButton />
      </div>

      <div className={styles.raffleDetails}>
        <div className={styles.raffleInfo}>
          <div className={styles.raffleFigure} onClick={() => setOpen(true)}>
            <ZoomableImage
              zoomSrc={raffle.product.image?.[0] || "/algira.svg"}
              src={raffle.product.image?.[0] || "/algira.svg"}
              alt={raffle.product.title}
            />
          </div>

          <Lightbox
            open={open}
            index={index}
            close={() => setOpen(false)}
            slides={(raffle.product.image ?? []).map((img) => ({
              src: img || "/algira.svg",
            }))}
            plugins={[Thumbnails, Zoom]}
            styles={{
              container: { backgroundColor: "#000000b7", zIndex: 5000 },
            }}
            animation={{ swipe: 300, fade: 500 }}
          />

          <div className={styles.raffleContent}>
            <section className={styles.raffleRow}>
              <h1 className={styles.raffleTitle}>{raffle.product.title}</h1>
            </section>

            <section className={styles.raffleRow}>
              <div className={styles.raffleCol}>
                <h3 className={styles.raffleDescriptionTitle}>Descripción</h3>
                <p className={styles.raffleDescription}>
                  {raffle.product.description}
                </p>
              </div>
            </section>

            <section className={styles.raffleRow}>
              <div className={styles.raffleCol}>
                <h3 className={styles.rafflePriceTicketTitle}>
                  Precio de Ticket
                </h3>
                <p className={styles.rafflePriceTicket}>{raffle.price} USD</p>
              </div>
              <div className={styles.raffleCol}>
                <h3 className={styles.rafflePriceArticleTitle}>
                  Referencia del artículo
                </h3>
                <div className={styles.raffleRow}>
                  <p className={styles.raffleReference}>
                    {raffle.product.shortDescription}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
        <section className={styles.rafflePurchase}>
          {quantityAvailable > 0 ? (
            isFinished ? (
              <Link href={`/results`} className={`${styles.cardButton} `}>
                Resultados
              </Link>
            ) : (
              <Link
                className={styles.cardButton}
                href={`/raffle/${raffle.id}/tickets${
                  ticketsInCart ? `?tickets=${ticketsInCart}` : ""
                }`}
              >
                Comprar Ticket
              </Link>
            )
          ) : (
            <Button
              className={`${styles.cardButton} ${styles.cardButtonDisabled}`}
              disabled
            >
              Agotado
            </Button>
          )}
        </section>
      </div>
    </section>
  );
};

export default RaffleDetail;
