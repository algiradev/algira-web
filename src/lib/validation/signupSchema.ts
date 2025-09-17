import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es requerido"),
  firstName: z.string().min(1, "Los nombres son requeridos"),
  lastName: z.string().min(1, "Los apellidos son requeridos"),
  email: z.string().min(1, "El correo es requerido").email("Correo inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.+/])[A-Za-z\d@$!%*#?&.+/]{8,}$/,
      {
        message: "Debe contener letra, número y un carácter especial",
      }
    ),
  countryId: z
    .number({ error: "El país es requerido" })
    .min(1, "El país es requerido"),
  phoneNumber: z
    .string({ error: "El número de teléfono es requerido" })
    .min(1, "El número de teléfono es requerido")
    .refine((value) => isValidPhoneNumber(value), {
      message: "Número de teléfono inválido",
    }),
  address: z
    .string({ error: "La dirección es requerida" })
    .min(1, "La dirección es requerida"),
  zipCode: z
    .string({ error: "El código postal es requerida" })
    .min(1, "El código postal es requerido"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
