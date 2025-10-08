"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { forgotPassword } from "@/lib/api/user";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "@/lib/validation/password";
import Loader from "@/components/loader/Loader";
import Button from "@/components/button/Button";
import styles from "../login/Login.module.css";

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    console.log("Forgot Password Data:", data.email);
    try {
      setSubmitting(true);
      setError(null);
      const res = await forgotPassword(data.email);
      toast.success(
        res.message ||
          "Correo de restablecimiento enviado. Revisa tu bandeja de entrada."
      );
      router.push("/login");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo enviar el correo de restablecimiento.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.form__container}>
      {submitting && <Loader />}
      <div className={styles.form__card}>
        <h2 className={styles.title}>Restablecer Contraseña</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.signup__form}>
          {/* Email */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Correo Electrónico</label>
            <input
              type="email"
              {...register("email")}
              className={styles.input}
              disabled={submitting}
            />
          </div>

          <Button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? "Cargando..." : "Enviar Correo"}
          </Button>

          <p className={styles.registerText}>
            ¿Recordaste tu contraseña?{" "}
            <span
              className={styles.registerLink}
              onClick={() => router.push("/login")}
            >
              Inicia Sesión
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
