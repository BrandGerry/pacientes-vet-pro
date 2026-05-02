import { z } from "zod";

export const passwordSchema = (isRegister: boolean) =>
  z
    //ESPERO RECIBIR UN OBJETO CON ESTA ESTRUCTURA Y ESTAS REGLAS
    .object({
      email: z.string().email("Correo inválido"), //DEBE SER STRING Y DEBE SER EMAIL
      password: z.string().min(6, "Mínimo 6 caracteres"), //DEBE TENER MINIMO 6 CARACTERES
      confirmpassword: isRegister
        ? z.string().min(6, "Mínimo 6 caracteres")
        : z.string().optional(),
    })
    //LOGICA PERSONALIZADA
    .refine((data) => !isRegister || data.password === data.confirmpassword, {
      message: "Las contraseñas deben ser iguales",
      path: ["confirmpassword"], //ESTA VALIDACION SE LE ASIGNA A CONFIRM PASSWORD
    });

export const magicSchema = z.object({
  email: z.string().email("Correo inválido"),
});
