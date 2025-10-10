export type CommentItem = {
  id: number;
  name: string;
  comment: string;
  img: string | null;
  rating: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337/api";

export async function getComments(): Promise<{ data: CommentItem[] }> {
  const res = await fetch(`${API_URL}/comments`, { method: "GET" });

  if (!res.ok) {
    throw new Error("No se pudo obtener la información de Comments.");
  }

  const data: CommentItem[] = await res.json();

  return { data };
}
