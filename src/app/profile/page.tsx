"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";

import Loader from "@/components/loader/Loader";
import Button from "@/components/button/Button";
import { MyApiUser, updateUser, uploadAvatar } from "@/lib/api/user";
import {
  profileSchema,
  ProfileFormValues,
} from "@/lib/validation/profileSchema";

import styles from "./Profile.module.css";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/useCart";
import { MyInvoice } from "@/types/invoice";
import { getUserInvoices } from "@/lib/api/invoice";
import { formatDateTime } from "@/utils/formatDate";
import { isTokenExpired } from "@/utils/jwt";
import ProfileTabs from "@/components/profile-tabs/ProfileTabs";

export default function Profile() {
  const inputImage = useRef<HTMLInputElement>(null);
  const [user, setUserProfile] = useState<MyApiUser | null>(null);
  const [urlTempImage, setUrlTempImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [invoices, setInvoices] = useState<MyInvoice[]>([]);

  const { logout } = useAuth();
  const { clearCart } = useCart();

  const [countries, setCountries] = useState<{ id: number; name: string }[]>([
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

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phoneNumber: "",
      address: "",
      zipCode: "",
      countryId: 0,
    },
  });

  // Cargar datos del usuario desde localStorage
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const userData = localStorage.getItem("user");
        if (!accessToken || !userData) {
          clearCart();
          router.push("/login");
          return;
        }

        const userResponse: MyApiUser = JSON.parse(userData);
        setUserProfile(userResponse);
        setValue("firstName", userResponse.firstName || "");
        setValue("lastName", userResponse.lastName || "");
        setValue("username", userResponse.username || "");
        setValue("email", userResponse.email || "");
        setValue("phoneNumber", userResponse.phoneNumber || "");
        setValue("address", userResponse.address || "");
        setValue("zipCode", userResponse.zipCode || "");
        setValue("countryId", userResponse.countryId || 0);
        setLoading(false);
      } catch (err) {
        toast.error("Error al cargar datos del usuario.");
        router.push("/login");
      }
    };
    fetchData();
  }, [router, setValue]);

  const handleClickUploadImage = () => {
    inputImage.current?.click();
  };

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      try {
        const url = URL.createObjectURL(file);
        setUrlTempImage(url);
        const uploadedUrl = await uploadAvatar(user.id, file);
        setUserProfile((prev) =>
          prev ? { ...prev, avatar: uploadedUrl } : null
        );
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, avatar: uploadedUrl })
        );
        toast.success("Imagen de perfil actualizada.");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al subir la imagen.";
        toast.error(message);
      }
    }
  };

  const onSubmitForm: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!user) return;
    try {
      setLoading(true);
      const updatedUser = await updateUser(user.id, data);
      toast.success("Se ha actualizado el usuario exitosamente");

      setUserProfile(updatedUser.user);
      localStorage.setItem("user", JSON.stringify(updatedUser.user));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al actualizar el usuario";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || isTokenExpired(token)) {
        toast.info("Tu sesión expiró, vuelve a iniciar sesión.");
        logout();
        return;
      }

      try {
        const data = await getUserInvoices(token);
        setInvoices(data);
      } catch (err: unknown) {
        console.error("Error al cargar historial de compras:", err);
      }
    };

    fetchInvoices();
  }, []);

  if (loading || !user) {
    return <Loader />;
  }

  return (
    <div className={styles.profile}>
      <section className={styles.profile__header}>
        <div className={styles.profile__header_text}>
          <h1>Hola {user.firstName}</h1>
          <p>
            Este es tu perfil, donde prodrás ver tu datos, tus tickets
            comprados, ganados y más.
          </p>
        </div>
        <div className={styles.buttons__wrapper}>
          <Button
            onClick={() => {
              logout();
              clearCart();
              router.push("/");
            }}
          >
            Cerrar sesión
          </Button>
        </div>
      </section>
      <section className={styles.profile__section_info}>
        <div className={styles.profile__avatar}>
          <header>
            <div
              className={styles.profile__shape}
              onClick={handleClickUploadImage}
            >
              <input
                className={styles.profile__shape__input_image}
                ref={inputImage}
                type="file"
                id="upload-image"
                name="upload-image"
                onChange={handleChangeImage}
                accept="image/png, image/jpeg"
              />
              <Image
                src={urlTempImage || user.avatar || "/algira.svg"}
                width={150}
                height={150}
                alt="profile"
              />
            </div>
          </header>

          <ProfileTabs invoices={invoices} />
        </div>
        <div className={styles.profile__myaccount}>
          <h2>Mi perfil</h2>
          <form onSubmit={handleSubmit(onSubmitForm)} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Usuario</label>
              <input
                className={styles.input}
                {...register("username")}
                disabled={disabled || loading}
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
                disabled={disabled || loading}
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
                disabled={disabled || loading}
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
                disabled={disabled || loading}
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
              <label className={styles.label}>País</label>
              <select
                className={styles.select}
                {...register("countryId", { valueAsNumber: true })}
                disabled={disabled || loading}
              >
                {countries.map((country) => (
                  <option
                    key={country.id}
                    value={country.id}
                    className={styles.option}
                  >
                    {country.name}
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
                value={watch("phoneNumber")}
                onChange={(value) =>
                  setValue("phoneNumber", value || "", {
                    shouldValidate: true,
                  })
                }
                disabled={disabled || loading}
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
                disabled={disabled || loading}
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
                disabled={disabled || loading}
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
              disabled={disabled || loading}
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
