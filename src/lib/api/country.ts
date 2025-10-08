import { MyApiCountry } from "@/types/country";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337/api";

export async function getCountries(): Promise<{ data: MyApiCountry[] }> {
  const res = await fetch(`${API_URL}/countries/all`, { method: "GET" });

  if (!res.ok) {
    throw new Error("No se pudieron obtener los países.");
  }

  const data: MyApiCountry[] = await res.json();

  return { data };
}
