export type SliderItem = {
  id: number;
  title?: string;
  alt: string;
  img: string;
  imgSmall?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337/api";

export async function getSlides(): Promise<{ data: SliderItem[] }> {
  const res = await fetch(`${API_URL}/sliders`, { method: "GET" });

  if (!res.ok) {
    throw new Error("No se pudieron obtener los slides.");
  }

  const data: SliderItem[] = await res.json();

  return { data };
}
