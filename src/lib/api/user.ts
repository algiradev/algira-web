import { toast } from "react-toastify";

export type MyApiUser = {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  zipCode?: string;
  address?: string;
  avatar?: string;
  city?: string;
  businessId?: number;
  countryId?: number;
  status_user?: string;
  rolId?: number;
};

export type MyApiLoginResponse = {
  accessToken: string;
  user: MyApiUser;
  expiresIn: number;
};

export type MyApiSignUpRequest = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  countryId?: number;
  phoneNumber?: string;
  address?: string;
  zipCode?: string;
};

export type MyApiSignUpResponse = {
  message: string;
};

export type MyApiForgotPasswordResponse = {
  message: string;
  tokenEmail?: string;
};

export type MyApiResetPasswordResponse = {
  message: string;
};

export type MyApiUpdateUserResponse = {
  message: string;
  user: MyApiUser;
};

export type ProfileFormValues = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  countryId: number;
  phoneNumber: string;
  address: string;
  zipCode: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337/api";

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

export async function uploadAvatar(id: number, file: File): Promise<string> {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No estás autenticado.");

  const formData = new FormData();
  formData.append("files", file);
  formData.append("ref", "plugin::users-permissions.user");
  formData.append("refId", id.toString());
  formData.append("field", "avatar");

  const res = await fetch(`${API_URL}/upload`, {
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

  const data = await res.json();
  return data[0].url;
}
