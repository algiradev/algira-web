"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";
import { sendContact } from "@/lib/api/contact";
import { contactSchema } from "@/lib/validation/contactFormSchem";
import { ContactPayload } from "@/types/contact";

export default function ContactForm() {
  const [form, setForm] = useState<ContactPayload>({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ContactPayload, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const parsed = contactSchema.safeParse({ type: "contact", ...form });

    if (!parsed.success) {
      const errors: Partial<Record<keyof ContactPayload, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactPayload;
        errors[field] = issue.message;
      });
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    // si pasa la validación, limpiamos errores
    setFieldErrors({});

    try {
      const data = await sendContact({ type: "contact", ...form });
      console.log("first", data);
      setSuccess("¡Enviado con éxito!");
      setForm({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "No se pudo enviar el formulario";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Contacto</h2>

      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Nombre
        </label>
        <input
          type="text"
          id="name"
          placeholder="Nombre"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={styles.input}
        />
        {fieldErrors.name && <p className={styles.error}>{fieldErrors.name}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Correo
        </label>
        <input
          type="email"
          id="email"
          placeholder="Correo"
          name="email"
          value={form.email}
          onChange={handleChange}
          className={styles.input}
        />
        {fieldErrors.email && (
          <p className={styles.error}>{fieldErrors.email}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Escribe tu mensaje..."
          value={form.message}
          onChange={handleChange}
          className={styles.textarea}
        />
        {fieldErrors.message && (
          <p className={styles.error}>{fieldErrors.message}</p>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <button type="submit" disabled={loading} className={styles.submit}>
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}
