"use client";

import { useState } from "react";
import { MyInvoice } from "@/types/invoice";
import { formatDateTime } from "@/utils/formatDate";
import styles from "./ProfileTabs.module.css";
import Link from "next/link";

type ProfileTabsProps = {
  invoices: MyInvoice[];
};

export default function ProfileTabs({ invoices }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"history" | "raffles">("history");

  // Todos los tickets del usuario para la pestaña "Mis rifas"
  const allTickets = invoices.flatMap((invoice) => invoice.tickets);

  // Agrupar tickets por rifa para "Mis rifas"
  const ticketsByRaffle = allTickets.reduce((acc, ticket) => {
    if (!ticket.raffle) return acc;
    if (!acc[ticket.raffle.id]) acc[ticket.raffle.id] = [];
    acc[ticket.raffle.id].push(ticket.number ?? 0);
    return acc;
  }, {} as Record<number, number[]>);

  return (
    <div className={styles.profileTabs}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={activeTab === "history" ? styles.active : ""}
          onClick={() => setActiveTab("history")}
        >
          Historial de compras
        </button>
        <button
          className={activeTab === "raffles" ? styles.active : ""}
          onClick={() => setActiveTab("raffles")}
        >
          Mis rifas
        </button>
      </div>

      {/* Contenido */}
      <div className={styles.tabContent}>
        {activeTab === "history" && (
          <div className={styles.scrollWrapper}>
            {invoices.length === 0 ? (
              <p>No has comprado tickets aún.</p>
            ) : (
              invoices.map((invoice) => {
                const ticketsByRaffleInvoice = invoice.tickets.reduce(
                  (acc, ticket) => {
                    if (!ticket.raffle) return acc;
                    if (!acc[ticket.raffle.id]) acc[ticket.raffle.id] = [];
                    acc[ticket.raffle.id].push(ticket);
                    return acc;
                  },
                  {} as Record<number, typeof invoice.tickets>
                );

                return (
                  <div key={invoice.id} className={styles.invoiceCard}>
                    <div className={styles.invoiceInfo}>
                      <div className={styles.left}>
                        <p>
                          <strong>Fecha:</strong>{" "}
                          {formatDateTime(invoice.transactionDate)}
                        </p>
                        <p>
                          <strong>Total:</strong> ${invoice.total.toFixed(2)}
                        </p>
                      </div>
                      <div className={styles.right}>
                        <p>
                          <strong>Código del invoice:</strong>{" "}
                          {invoice.transactionId}
                        </p>
                      </div>
                    </div>
                    <div className={styles.purchaseTableWrapper}>
                      <table className={styles.purchaseTable}>
                        <thead>
                          <tr>
                            <th>Rifa</th>
                            <th>Precio por ticket</th>
                            <th>Tickets</th>
                            <th>Fecha sorteo</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(ticketsByRaffleInvoice).map(
                            ([raffleId, tickets]) => (
                              <tr key={raffleId}>
                                <td>{tickets[0].raffle?.title}</td>
                                <td>${tickets[0].raffle?.price.toFixed(2)}</td>
                                <td>
                                  {tickets
                                    .map((t) => t.number ?? 0)
                                    .sort((a, b) => a - b)
                                    .join(", ")}
                                </td>
                                <td>
                                  {formatDateTime(
                                    tickets[0].raffle?.endDate ?? ""
                                  )}
                                </td>
                                <td>
                                  $
                                  {(tickets[0].raffle?.price ?? 0) *
                                    tickets.length}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "raffles" && (
          <div className={styles.scrollWrapper}>
            {Object.entries(ticketsByRaffle).length === 0 ? (
              <p>No tienes rifas aún.</p>
            ) : (
              Object.entries(ticketsByRaffle).map(([raffleId, numbers]) => {
                const raffle = allTickets.find(
                  (t) => t.raffle?.id === Number(raffleId)
                )?.raffle;
                if (!raffle) return null;
                return (
                  <Link href={`/raffle/${raffle.id}`} key={raffle.id}>
                    <div className={styles.raffleCard}>
                      <p>
                        <strong>Rifa:</strong> {raffle.title}
                      </p>
                      <p>
                        <strong>Fecha sorteo:</strong>{" "}
                        {formatDateTime(raffle.endDate)}
                      </p>
                      <p>
                        <strong>Tickets:</strong>{" "}
                        {numbers.sort((a, b) => a - b).join(", ")}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
