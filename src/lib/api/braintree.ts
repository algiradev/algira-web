// lib/api/payment.ts
const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337/api";

// ===============================
// GENERATE CLIENT TOKEN
// ===============================
export async function generateClientToken(): Promise<string> {
  const token = localStorage.getItem("accessToken") ?? "";

  const res = await fetch(`${API_URL}/braintree/token`, {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error fetching client token:", text);
    throw new Error("No se pudo obtener el client token");
  }

  const data = await res.json();
  return data.clientToken;
}

// ===============================
// PROCESS PAYMENT
// ===============================
interface TicketForPayment {
  number: number;
  raffleId: number;
}

interface ProcessPaymentBody {
  paymentMethodNonce: string;
  amount: number;
  raffles: number[];
  tickets: TicketForPayment[];
}

export async function processPayment(body: ProcessPaymentBody) {
  const token = localStorage.getItem("accessToken") ?? "";

  const res = await fetch(`${API_URL}/braintree/process-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error processing payment:", text);
    throw new Error("No se pudo procesar el pago");
  }

  return res.json();
}
