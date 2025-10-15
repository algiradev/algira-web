import { FooterContact, FooterSocialNetwork } from "@/types/footer";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337/api";

export async function getFooterSocialNetworks(): Promise<
  FooterSocialNetwork[]
> {
  const res = await fetch(`${API_URL}/footer-social-networks/all`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("No se pudieron obtener las redes sociales del footer.");
  }

  const data = await res.json();

  return data;
}

export async function getFooterContact(): Promise<{ data: FooterContact }> {
  const res = await fetch(`${API_URL}/footer-contact`, { method: "GET" });

  if (!res.ok) {
    throw new Error("No se pudo obtener el contacto del footer");
  }

  const data: FooterContact = await res.json();

  return { data };
}
