export type Ticket = {
  id: number;
  number: string;
  status_ticket: "a" | "i"; // activo o inactivo
  raffle: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337/api";

/**
 * Obtener todos los tickets
 */
export async function getTickets(): Promise<Ticket[]> {
  const res = await fetch(`${API_URL}/tickets`, { method: "GET" });

  if (!res.ok) {
    throw new Error("No se pudieron obtener los tickets.");
  }

  return res.json();
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
