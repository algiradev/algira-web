export type MyApiPost = {
  id?: number;
  title: string;
  shortDescription?: string;
  content?: string;
  status_post?: string;
  postsMultimedias?: { id?: number; image: string; type: string }[];
};

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337/api";

// ===============================
// GET LIST TABLE POSTS
// ===============================
export async function getPostsListTable(): Promise<MyApiPost[]> {
  const res = await fetch(`${API_URL}/posts/list-table`, { method: "GET" });

  if (!res.ok) throw new Error("No se pudieron obtener los posts");

  return res.json();
}

// ===============================
// FIND ONE BY TITLE
// ===============================
export async function getPostByTitle(title: string): Promise<MyApiPost> {
  const res = await fetch(`${API_URL}/posts/find-one-by-title`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) throw new Error("No se pudo obtener el post por título");

  return res.json();
}

// ===============================
// UPDATE POST
// ===============================
export async function updatePost(id: number, body: Partial<MyApiPost>) {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("No se pudo actualizar el post");

  return res.json();
}
