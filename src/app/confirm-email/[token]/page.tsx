"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "@/components/loader/Loader";
import { MyApiLoginResponse } from "@/types/user";

export default function ConfirmEmailPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const url =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/api/auth";

  useEffect(() => {
    const confirm = async () => {
      try {
        const res = await fetch(`${url}/confirm-email/${token}`);
        if (!res.ok) throw new Error("Error confirmando el correo");

        const data: MyApiLoginResponse = await res.json();

        // Guardar sesión
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success("Correo confirmado con éxito");
        router.push("/");
      } catch (err) {
        toast.error((err as Error)?.message || "Error en la confirmación");
      } finally {
        setLoading(false);
      }
    };

    if (token) confirm();
  }, [token, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return null;
}
