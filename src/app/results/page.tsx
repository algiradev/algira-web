"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./RaffleResults.module.css";
import { getRaffleResults, RaffleWinnerResult } from "@/lib/api/raffle-winner";
import Loader from "@/components/loader/Loader";
import { formatDateTime } from "../../utils/formatDate";

export default function ResultsPage() {
  const [highlightRaffleId, setHighlightRaffleId] = useState<number | null>(
    null
  );
  const [results, setResults] = useState<RaffleWinnerResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // rifas por página
  const raffleRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    async function fetchResults() {
      try {
        const { data } = await getRaffleResults();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();

    // Highlight desde state sin tocar URL
    if (history.state?.highlightRaffleId) {
      setHighlightRaffleId(history.state.highlightRaffleId);
    }
  }, []);

  // Scroll a rifa resaltada
  useEffect(() => {
    if (highlightRaffleId != null && raffleRefs.current[highlightRaffleId]) {
      raffleRefs.current[highlightRaffleId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightRaffleId, page]);

  if (loading) return <Loader />;

  // Agrupar resultados por rifa
  const resultsByRaffle = results.reduce((acc, r) => {
    if (!acc[r.id])
      acc[r.id] = { title: r.raffleTitle, items: [] as RaffleWinnerResult[] };
    acc[r.id].items.push(r);
    return acc;
  }, {} as Record<number, { title: string; items: RaffleWinnerResult[] }>);

  const raffleIds = Object.keys(resultsByRaffle).map(Number);
  const totalPages = Math.ceil(raffleIds.length / itemsPerPage);
  const paginatedRaffleIds = raffleIds.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className={styles.profileTabs}>
      <div className={styles.scrollWrapper}>
        {raffleIds.length === 0 ? (
          <p className={styles.noResults}>No hay resultados todavía.</p>
        ) : (
          paginatedRaffleIds.map((raffleId) => {
            const raffleResults = resultsByRaffle[raffleId];
            return (
              <div
                key={raffleId}
                className={`${styles.raffleCard} ${
                  highlightRaffleId === raffleId ? styles.highlightCard : ""
                }`}
                ref={(el) => {
                  raffleRefs.current[raffleId] = el;
                }}
              >
                <p>
                  <strong>Rifa:</strong> {raffleResults.title}
                </p>
                <div className={styles.purchaseTableWrapper}>
                  <table className={styles.purchaseTable}>
                    <thead>
                      <tr style={{ backgroundColor: "#00897d", color: "#fff" }}>
                        <th>Fecha sorteo</th>
                        <th>Ticket Ganador</th>
                        <th>Ganador</th>
                      </tr>
                    </thead>
                    <tbody>
                      {raffleResults.items.map((r) => (
                        <tr key={r.id}>
                          <td>{formatDateTime(r.wonAt)}</td>
                          <td>{r.ticketNumber}</td>
                          <td>{r.winnerName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Paginación global debajo de profileTabs */}
      {raffleIds.length >= itemsPerPage && (
        <div className={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
