export type MyApiCountry = {
  id: number;
  name: string;
  areaCode?: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337/api";

export async function getCountries(): Promise<{ data: MyApiCountry[] }> {
  const res = await fetch(`${API_URL}/country`, { method: "GET" });

  if (!res.ok) {
    throw new Error("No se pudieron obtener los países.");
  }

  return res.json();
}
