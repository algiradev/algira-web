"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

import { login, MyApiLoginResponse } from "@/lib/api/user";
import Loader from "@/components/loader/Loader";
import { loginSchema, LoginFormValues } from "@/lib/validation/loginSchema";

import styles from "./Login.module.css";
import Button from "@/components/button/Button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/useCart";

export default function LoginPage() {
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuth();
  const { cart } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    let redirectUrl = searchParams.get("redirect") || "/";

    if (redirectUrl === "/checkout" && cart.length === 0) {
      redirectUrl = "/";
    }

    try {
      setSubmitting(true);
      setLoginError(null);

      const res: MyApiLoginResponse = await login(data.email, data.password);

      if (!res.accessToken) {
        toast.error(
          "Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada."
        );
        setSubmitting(false);
        return;
      }

      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);

      toast.success(`Bienvenido ${res.user.username}`);

      router.push(redirectUrl);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No se pudo iniciar sesión";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.form__container}>
      <div className={styles.form__card}>
        <h2 className={styles.title}>Ingreso</h2>

        {submitting && <Loader />}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.signup__form}>
          {/* Email */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Correo/Usuario</label>
            <input
              type="text"
              {...register("email")}
              className={styles.input}
              disabled={submitting}
            />
            <p
              className={`${styles.error} ${
                errors.email ? styles.visible : ""
              }`}
            >
              {errors.email?.message || ""}
            </p>
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Contraseña</label>
            <input
              type="password"
              {...register("password")}
              className={styles.input}
              disabled={submitting}
            />
            <p
              className={`${styles.error} ${
                errors.password ? styles.visible : ""
              }`}
            >
              {errors.password?.message || ""}
            </p>
          </div>

          <p className={styles.forgotPassword}>
            <span
              className={styles.forgotPasswordLink}
              onClick={() => router.push("/forgot-password")}
            >
              ¿Olvidaste tu contraseña?
            </span>{" "}
          </p>

          {loginError && <p className={styles.error}>{loginError}</p>}

          <Button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? "Cargando..." : "Ingresar"}
          </Button>

          <p className={styles.registerText}>
            ¿Aún no eres miembro?{" "}
            <span
              className={styles.registerLink}
              onClick={() => router.push("/signup")}
            >
              Regístrate
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
