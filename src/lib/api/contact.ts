import { ContactPayload } from "@/types/contact";
import { FeedbackPayload } from "@/types/feedback";

export type UnifiedPayload =
  | ({ type: "contact" } & ContactPayload)
  | ({ type: "feedback" } & FeedbackPayload);

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337/api";

export async function sendContact(data: UnifiedPayload) {
  if (data.type === "feedback" && data.image) {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("message", data.message);
    if (data.email) formData.append("email", data.email);
    formData.append("image", data.image);

    const res = await fetch(`${API_URL}/contacts`, {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Error al enviar feedback");
    return json;
  }

  const res = await fetch(`${API_URL}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Error al enviar contacto");
  return json;
}
