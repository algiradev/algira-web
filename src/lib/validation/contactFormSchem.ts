import { z } from "zod";

export const contactSchema = z.object({
  type: z.literal("contact"),
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Correo inválido"),
  message: z.string().min(1, "El mensaje es obligatorio"),
});

export const feedbackSchema = z.object({
  type: z.literal("feedback"),
  email: z.string().optional(),
  message: z.string().min(1, "El mensaje es obligatorio"),
  image: z
    .any()
    .refine(
      (file) => !file || file instanceof File,
      "Debe ser un archivo válido"
    )
    .optional(),
});

export const unifiedSchema = z.union([contactSchema, feedbackSchema]);
