import { MyRaffle } from "@/types/raffle";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337/api";

// ===============================
// CREATE RAFFLE
// ===============================
export async function createRaffle(body: Partial<MyRaffle>) {
  const res = await fetch(`${API_URL}/raffle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("No se pudo crear el raffle");

  return res.json();
}

// ===============================
// FIND ALL RAFFLES
// ===============================
export async function getRaffles(): Promise<MyRaffle[]> {
  const res = await fetch(`${API_URL}/raffles`, { method: "GET" });

  if (!res.ok) throw new Error("No se pudieron obtener los raffles");

  return res.json();
}

// ===============================
// FIND ONE RAFFLE
// ===============================
export async function getRaffleById(id: number): Promise<MyRaffle> {
  const res = await fetch(`${API_URL}/raffles/${id}`, { method: "GET" });

  if (!res.ok) throw new Error("No se pudo obtener el raffle");

  return res.json();
}

// ===============================
// UPDATE RAFFLE
// ===============================
export async function updateRaffle(id: number, body: Partial<MyRaffle>) {
  const res = await fetch(`${API_URL}/raffle/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("No se pudo actualizar el raffle");

  return res.json();
}

// ===============================
// DELETE RAFFLE
// ===============================
export async function deleteRaffle(id: number) {
  const res = await fetch(`${API_URL}/raffle/${id}`, { method: "DELETE" });

  if (!res.ok) throw new Error("No se pudo eliminar el raffle");

  return res.json();
}
