// lib/api/invoice.ts
import { MyInvoice } from "@/types/invoice"; // crea este type luego
const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337/api";

// ===============================
// GET USER INVOICES
// ===============================
export async function getUserInvoices(
  accessToken: string
): Promise<MyInvoice[]> {
  const res = await fetch(`${API_URL}/invoices/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error("No se pudo obtener el historial de compras");

  return res.json();
}
