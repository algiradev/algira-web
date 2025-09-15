import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1, "Los nombres son requeridos."),
  lastName: z.string().min(1, "Los apellidos son requeridos."),
  username: z.string().min(1, "El nombre de usuario es requerido."),
  email: z.string().email("Correo inválido").min(1, "El correo es requerido."),
  countryId: z.number().min(1, "El país es requerido."),
  phoneNumber: z.string().min(1, "El teléfono es requerido."),
  address: z.string().min(1, "La dirección es requerida."),
  zipCode: z.string().min(1, "El código postal es requerido."),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
