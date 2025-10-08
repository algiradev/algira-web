"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { resetPassword } from "@/lib/api/user";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "@/lib/validation/password";
import Loader from "@/components/loader/Loader";
import Button from "@/components/button/Button";
import styles from "../../login/Login.module.css";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const router = useRouter();
  const { token } = useParams<{ token: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setError("Token inválido o faltante.");
      toast.error("Token inválido o faltante.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await resetPassword(token, data.password);
      toast.success(res.message || "Contraseña restablecida correctamente.");
      router.push("/login");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo restablecer la contraseña.";
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
        <h2 className={styles.title}>Nueva Contraseña</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.signup__form}>
          {/* Password */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Nueva Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={styles.input}
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={styles.toggleButton}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <p
              className={`${styles.error} ${
                errors.password ? styles.visible : ""
              }`}
            >
              {errors.password?.message || ""}
            </p>
          </div>

          {/* Confirm Password */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Confirmar Contraseña</label>
            <input
              type={showPasswordConfirm ? "text" : "password"}
              {...register("confirmPassword")}
              className={styles.input}
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm((prev) => !prev)}
              className={styles.toggleButton}
              aria-label={
                showPasswordConfirm
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <p
              className={`${styles.error} ${
                errors.confirmPassword ? styles.visible : ""
              }`}
            >
              {errors.confirmPassword?.message || ""}
            </p>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <Button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? "Cargando..." : "Restablecer Contraseña"}
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
