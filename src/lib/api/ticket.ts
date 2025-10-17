export type Ticket = {
  id: number;
  number: string;
  status_ticket: "a" | "i";
  raffle: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337/api";

/**
 * Obtener tickets comprados (ocupados) de una rifa
 */
export async function getPurchasedTickets(raffleId: number): Promise<number[]> {
  try {
    const res = await fetch(`${API_URL}/tickets/taken?raffleId=${raffleId}`, {
      method: "GET",
    });

    if (!res.ok) {
      console.error("Error fetching purchased tickets", await res.text());
      return [];
    }

    const data = await res.json();
    // El backend devuelve { takenNumbers: number[] }
    return data.takenNumbers ?? [];
  } catch (err) {
    console.error("Error fetching purchased tickets", err);
    return [];
  }
}

/**
 * Obtener un ticket por id
 */
export async function getTicket(id: number): Promise<Ticket> {
  const res = await fetch(`${API_URL}/tickets/${id}`, { method: "GET" });

  if (!res.ok) {
    throw new Error("No se pudo obtener el ticket.");
  }

  return res.json();
}

/**
 * Obtener tickets por raffle
 */
export async function getTicketsByRaffle(raffleId: number): Promise<Ticket[]> {
  const res = await fetch(`${API_URL}/tickets/raffle/${raffleId}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("No se pudieron obtener los tickets para este raffle.");
  }

  return res.json();
}

/**
 * Eliminar todos los tickets
 */
export async function deleteAllTickets(): Promise<{
  message: string;
  count: number;
}> {
  const res = await fetch(`${API_URL}/tickets`, { method: "DELETE" });

  if (!res.ok) {
    throw new Error("No se pudieron eliminar los tickets.");
  }

  return res.json();
}
