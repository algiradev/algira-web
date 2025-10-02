export type AboutUsItem = {
  id: number;
  title: string;
  text?: string;
  shortText: string;
  img: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337/api";

export async function getAboutUs(): Promise<{ data: AboutUsItem[] }> {
  const res = await fetch(`${API_URL}/about-us`, { method: "GET" });

  if (!res.ok) {
    throw new Error("No se pudo obtener la información de About Us.");
  }

  const data: AboutUsItem[] = await res.json();

  return { data };
}
