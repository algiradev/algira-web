import {
  MyApiForgotPasswordResponse,
  MyApiLoginResponse,
  MyApiResetPasswordResponse,
  MyApiSignUpRequest,
  MyApiSignUpResponse,
  MyApiUpdateUserResponse,
  ProfileFormValues,
} from "@/types/user";
import { toast } from "react-toastify";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337/api";

export async function login(
  email: string,
  password: string
): Promise<MyApiLoginResponse> {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || "No se pudo iniciar sesión.";

    throw new Error(msg);
  }

  return res.json();
}

export async function signUp(
  data: MyApiSignUpRequest
): Promise<MyApiSignUpResponse> {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      err?.error?.message || err?.message || "No se pudo registrar el usuario.";
    throw new Error(msg, { cause: err?.error?.details?.field });
  }

  return res.json();
}

export async function confirmEmail(token: string): Promise<MyApiLoginResponse> {
  const res = await fetch(`${API_URL}/auth/confirm-email/${token}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error || err?.message || "No se pudo confirmar el correo.";
    throw new Error(msg);
  }

  const data: MyApiLoginResponse = await res.json();
  return data;
}

export async function forgotPassword(
  email: string
): Promise<MyApiForgotPasswordResponse> {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      err?.error?.message || "No se pudo enviar el correo de restablecimiento.";
    throw new Error(msg);
  }

  return res.json();
}

export async function resetPassword(
  token: string,
  password: string
): Promise<MyApiResetPasswordResponse> {
  const res = await fetch(`${API_URL}/auth/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || "No se pudo restablecer la contraseña.";
    throw new Error(msg);
  }

  return res.json();
}

export function logout(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  toast.success("Gracias por visitar Algira. Esperamos que vuelva pronto.");
}

export async function updateUser(
  id: number,
  data: ProfileFormValues
): Promise<MyApiUpdateUserResponse> {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No estás autenticado.");

  const res = await fetch(`${API_URL}/users-algira/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "No se pudo actualizar el perfil.");
  }

  return res.json();
}

export async function uploadAvatar(
  file: File
): Promise<MyApiUpdateUserResponse> {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No estás autenticado.");

  const formData = new FormData();
  formData.append("files", file);

  const res = await fetch(`${API_URL}/auth/update-avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "No se pudo subir la imagen.");
  }

  return res.json();
}
