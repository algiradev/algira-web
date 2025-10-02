"use client";

import { useEffect, useState } from "react";
import styles from "./RaffleResults.module.css";
import { getRaffleResults, RaffleWinnerResult } from "@/lib/api/raffle-winner";
import Loader from "@/components/loader/Loader";
import { formatDateTime } from "../../utils/formatDate";

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<"recent" | "all">("recent");
  const [results, setResults] = useState<RaffleWinnerResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const { data } = await getRaffleResults();
        setResults(data);
        console.log("resutls", data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, []);

  if (loading) return <Loader />;

  // Agrupar resultados por rifa
  const resultsByRaffle = results.reduce((acc, r) => {
    if (!acc[r.raffleTitle]) acc[r.raffleTitle] = [];
    acc[r.raffleTitle].push(r);
    return acc;
  }, {} as Record<string, RaffleWinnerResult[]>);

  return (
    <div className={styles.profileTabs}>
      <div className={styles.scrollWrapper}>
        {Object.entries(resultsByRaffle).length === 0 ? (
          <p className={styles.noResults}>No hay resultados todavía.</p>
        ) : (
          Object.entries(resultsByRaffle).map(
            ([raffleTitle, raffleResults]) => (
              <div key={raffleTitle} className={styles.raffleCard}>
                <p>
                  <strong>Rifa:</strong> {raffleTitle}
                </p>
                <div className={styles.purchaseTableWrapper}>
                  <table className={styles.purchaseTable}>
                    <thead>
                      <tr>
                        <th>Fecha sorteo</th>
                        <th>Ticket Ganador</th>
                        <th>Ganador</th>
                      </tr>
                    </thead>
                    <tbody>
                      {raffleResults.map((r) => (
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
            )
          )
        )}
      </div>
    </div>
  );
}
