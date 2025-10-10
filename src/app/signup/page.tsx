"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import PhoneInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";

import { signUp } from "@/lib/api/user";
import Loader from "@/components/loader/Loader";
import { signUpSchema, SignUpFormValues } from "@/lib/validation/signupSchema";

import styles from "./Signup.module.css";
import Button from "@/components/button/Button";
import { getCountries } from "@/lib/api/country";
import { MyApiCountry } from "@/types/country";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<MyApiCountry[]>([
    {
      id: 1,
      name: "Venezuela",
    },
    {
      id: 2,
      name: "Uruguay",
    },
    {
      id: 3,
      name: "Suiza",
    },
  ]);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  // Fetch countries

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      setLoading(true);
      await signUp(data);
      console.log("Usuario registrado:", data);
      toast.success(
        "Usuario registrado, revisa tu email para verificar tu cuenta"
      );
      router.push("/login");
    } catch (err: unknown) {
      const error = err as Error & { cause?: string };
      const errorMessage = error.message || "No se pudo crear el usuario";
      const errorField = error.cause;
      if (errorField === "email" || errorField === "username") {
        setError(errorField, { message: errorMessage });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await getCountries();
        setCountries(response.data);
        console.log(response);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCountries();
  }, []);

  return (
    <>
      <div className={styles.form__container}>
        {loading && <Loader />}
        <div className={styles.form__card}>
          <h2 className={styles.title}>Registro</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Usuario</label>
              <input
                className={styles.input}
                {...register("username")}
                disabled={loading}
              />
              <p
                className={`${styles.error} ${
                  errors.username ? styles.visible : ""
                }`}
              >
                {errors.username?.message || ""}
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Nombres</label>
              <input
                className={styles.input}
                {...register("firstName")}
                disabled={loading}
              />
              <p
                className={`${styles.error} ${
                  errors.firstName ? styles.visible : ""
                }`}
              >
                {errors.firstName?.message || ""}
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Apellidos</label>
              <input
                className={styles.input}
                {...register("lastName")}
                disabled={loading}
              />
              <p
                className={`${styles.error} ${
                  errors.lastName ? styles.visible : ""
                }`}
              >
                {errors.lastName?.message || ""}
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Correo</label>
              <input
                className={styles.input}
                type="email"
                {...register("email")}
                disabled={loading}
              />
              <p
                className={`${styles.error} ${
                  errors.email ? styles.visible : ""
                }`}
              >
                {errors.email?.message || ""}
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Contraseña</label>

              <input
                className={styles.input}
                type={showPassword ? "text" : "password"}
                {...register("password")}
                disabled={loading}
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

            <div className={styles.formGroup}>
              <label className={styles.label}>País</label>
              <select
                className={styles.input}
                {...register("countryId", { valueAsNumber: true })}
                disabled={loading}
              >
                <option value="">Selecciona un país</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p
                className={`${styles.error} ${
                  errors.countryId ? styles.visible : ""
                }`}
              >
                {errors.countryId?.message || ""}
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Teléfono</label>
              <PhoneInput
                international
                defaultCountry="VE"
                flags={flags}
                className={styles.phoneInput}
                onChange={(value) =>
                  setValue("phoneNumber", value || "", {
                    shouldValidate: true,
                  })
                }
                disabled={loading}
              />
              <p
                className={`${styles.error} ${
                  errors.phoneNumber ? styles.visible : ""
                }`}
              >
                {errors.phoneNumber?.message || ""}
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Dirección</label>
              <input
                className={styles.input}
                {...register("address")}
                disabled={loading}
              />
              <p
                className={`${styles.error} ${
                  errors.address ? styles.visible : ""
                }`}
              >
                {errors.address?.message || ""}
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Código postal</label>
              <input
                className={styles.input}
                {...register("zipCode")}
                disabled={loading}
              />
              <p
                className={`${styles.error} ${
                  errors.zipCode ? styles.visible : ""
                }`}
              >
                {errors.zipCode?.message || ""}
              </p>
            </div>

            <Button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
