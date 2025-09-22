import { ContactPayload } from "@/types/contact";
import { FeedbackPayload } from "@/types/feedback";

export type UnifiedPayload =
  | ({ type: "contact" } & ContactPayload)
  | ({ type: "feedback" } & FeedbackPayload);

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337/api";

export async function sendContact(data: UnifiedPayload) {
  let body: FormData | string;
  const headers: Record<string, string> = {};

  if (data.type === "feedback" && data.image) {
    body = new FormData();
    body.append("type", data.type);
    body.append("message", data.message);
    if (data.email) body.append("email", data.email);
    body.append("image", data.image);
  } else {
    body = JSON.stringify(data);
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}/contacts`, {
    method: "POST",
    headers,
    body,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "Error al enviar formulario");
  }

  return json;
}
