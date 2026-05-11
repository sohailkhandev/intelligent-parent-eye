import { z } from "zod";

interface AuthValidationMessages {
  emailRequired?: string;
  emailInvalid?: string;
  emailCannotBeNumber?: string;
  passwordRequired?: string;
  passwordMin?: string;
  passwordMax?: string;
  fullNameRequired?: string;
  fullNameMin?: string;
  fullNameMax?: string;
  confirmPasswordRequired?: string;
  passwordsDoNotMatch?: string;
  termsRequired?: string;
  otpRequired?: string;
  otpMin?: string;
  otpMax?: string;
  otpInvalid?: string;
  newPasswordRequired?: string;
}

export const createFormLoginSchema = (t?: AuthValidationMessages) => {
  return z.object({
    email: z
      .string({ message: t?.emailCannotBeNumber || "Cannot be a number" })
      .nonempty({ message: t?.emailRequired || "Email is required" })
      .email({ message: t?.emailInvalid || "Please enter a valid email address" }),
    password: z
      .string()
      .nonempty({ message: t?.passwordRequired || "Password is required" })
      .min(6, { message: t?.passwordMin || "Password must be at least 6 characters" }),
  });
};

export const FormLoginSchema = createFormLoginSchema();
export type FormLoginType = z.infer<ReturnType<typeof createFormLoginSchema>>;

export const createFormRegisterSchema = (t?: AuthValidationMessages) => {
  return z
    .object({
      fullName: z
        .string()
        .nonempty({ message: t?.fullNameRequired || "Full name is required" })
        .min(2, { message: t?.fullNameMin || "Name must be at least 2 characters" })
        .max(100, { message: t?.fullNameMax || "Name must be less than 100 characters" }),
      email: z
        .string()
        .nonempty({ message: t?.emailRequired || "Email is required" })
        .email({ message: t?.emailInvalid || "Please enter a valid email address" }),
      password: z
        .string()
        .nonempty({ message: t?.passwordRequired || "Password is required" })
        .min(6, { message: t?.passwordMin || "Password must be at least 6 characters" })
        .max(128, { message: t?.passwordMax || "Password must be less than 128 characters" }),
      confirmPassword: z
        .string()
        .nonempty({ message: t?.confirmPasswordRequired || "Please confirm your password" }),
      terms: z
        .boolean()
        .refine((val) => val === true, {
          message: t?.termsRequired || "You must agree to the Terms of Service and Privacy Policy",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t?.passwordsDoNotMatch || "Passwords do not match",
      path: ["confirmPassword"],
    });
};

export const FormRegisterSchema = createFormRegisterSchema();
export type FormRegisterType = z.infer<ReturnType<typeof createFormRegisterSchema>>;

export const createFormForgotPasswordSchema = (t?: AuthValidationMessages) => {
  return z.object({
    email: z
      .string()
      .nonempty({ message: t?.emailRequired || "Email is required" })
      .email({ message: t?.emailInvalid || "Please enter a valid email address" }),
  });
};

export const FormForgotPasswordSchema = createFormForgotPasswordSchema();
export type FormForgotPasswordType = z.infer<ReturnType<typeof createFormForgotPasswordSchema>>;

export const createFormResetPasswordSchema = (t?: AuthValidationMessages) => {
  return z
    .object({
      otp: z
        .string()
        .nonempty({ message: t?.otpRequired || "OTP is required" })
        .min(6, { message: t?.otpMin || "OTP must be 6 digits" })
        .max(6, { message: t?.otpMax || "OTP must be 6 digits" })
        .regex(/^\d+$/, { message: t?.otpInvalid || "OTP must contain only numbers" }),
      newPassword: z
        .string()
        .nonempty({ message: t?.newPasswordRequired || "New password is required" })
        .min(6, { message: t?.passwordMin || "Password must be at least 6 characters" })
        .max(128, { message: t?.passwordMax || "Password must be less than 128 characters" }),
      confirmPassword: z
        .string()
        .nonempty({ message: t?.confirmPasswordRequired || "Please confirm your password" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t?.passwordsDoNotMatch || "Passwords do not match",
      path: ["confirmPassword"],
    });
};

export const FormResetPasswordSchema = createFormResetPasswordSchema();
export type FormResetPasswordType = z.infer<ReturnType<typeof createFormResetPasswordSchema>>;