export type RaffleWinnerResult = {
  id: number;
  raffleTitle: string;
  wonAt: string;
  ticketNumber: string;
  winnerName: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337/api";

export async function getRaffleResults(): Promise<{
  data: RaffleWinnerResult[];
}> {
  const res = await fetch(`${API_URL}/raffle-results`, { method: "GET" });

  if (!res.ok) {
    throw new Error("No se pudieron obtener los resultados.");
  }

  const data: RaffleWinnerResult[] = await res.json();
  return { data };
}
