"use client";

import { useState } from "react";
import styles from "./FeedbackForm.module.css";
import { sendContact } from "@/lib/api/contact";
import { feedbackSchema } from "@/lib/validation/contactFormSchem";
import { FeedbackPayload } from "@/types/feedback";

export default function FeedbackForm() {
  const [form, setForm] = useState<FeedbackPayload>({
    message: "",
    email: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FeedbackPayload, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, image: e.target.files?.[0] || null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const parsed = feedbackSchema.safeParse({ type: "feedback", ...form });

    if (!parsed.success) {
      const errors: Partial<Record<keyof FeedbackPayload, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FeedbackPayload;
        errors[field] = issue.message;
      });
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    setFieldErrors({});

    try {
      await sendContact({ type: "feedback", ...form });
      setSuccess("¡Enviado con éxito!");
      setForm({ email: "", message: "", image: null });
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
      <h2 className={styles.title}>
        ¡Dinos lo que quieres! <br /> Puede ser tuyo
      </h2>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Correo
        </label>
        <input
          type="email"
          id="email"
          placeholder="Correo (opcional)"
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
          ¿Qué te gustaría ganar?
        </label>
        <textarea
          id="message"
          placeholder="Describe tu idea"
          name="message"
          value={form.message}
          onChange={handleChange}
          className={styles.textarea}
        />
        {fieldErrors.message && (
          <p className={styles.error}>{fieldErrors.message}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="image" className={styles.label}>
          Muéstranos qué quieres
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.inputFile}
        />
        {fieldErrors.image && (
          <p className={styles.error}>{fieldErrors.image}</p>
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
