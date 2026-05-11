import { z } from "zod";

interface UserValidationMessages {
  displayNameRequired?: string;
  displayNameMin?: string;
  displayNameMax?: string;
  genderRequired?: string;
  ageGroupRequired?: string;
  countryRequired?: string;
  introductionRequired?: string;
  introductionMin?: string;
  introductionMax?: string;
  currentPasswordRequired?: string;
  currentPasswordMin?: string;
  newPasswordRequired?: string;
  newPasswordMin?: string;
  newPasswordMax?: string;
  confirmPasswordRequired?: string;
  passwordsDoNotMatch?: string;
}

export const createFormCompleteProfileSchema = (t?: UserValidationMessages) => {
  return z.object({
    displayName: z
      .string()
      .nonempty({ message: t?.displayNameRequired || "Display name is required" })
      .min(2, { message: t?.displayNameMin || "Display name must be at least 2 characters" })
      .max(100, { message: t?.displayNameMax || "Display name must be less than 100 characters" }),
    gender: z
      .string()
      .nonempty({ message: t?.genderRequired || "Gender is required" }),
    preferredGender: z.string().min(1),
    ageGroup: z
      .string()
      .nonempty({ message: t?.ageGroupRequired || "Age group is required" }),
    country: z
      .string()
      .nonempty({ message: t?.countryRequired || "Country is required" }),
    introduction: z
      .string()
      .nonempty({ message: t?.introductionRequired || "Introduction is required" })
      .min(10, { message: t?.introductionMin || "Introduction must be at least 10 characters" })
      .max(500, { message: t?.introductionMax || "Introduction must be less than 500 characters" }),
  });
};

export const FormCompleteProfileSchema = createFormCompleteProfileSchema();
export type FormCompleteProfileType = z.infer<ReturnType<typeof createFormCompleteProfileSchema>>;

export const createFormEditProfileSchema = (t?: UserValidationMessages) => {
  return z.object({
    displayName: z
      .string()
      .nonempty({ message: t?.displayNameRequired || "Display name is required" })
      .min(2, { message: t?.displayNameMin || "Display name must be at least 2 characters" })
      .max(100, { message: t?.displayNameMax || "Display name must be less than 100 characters" }),
    ageGroup: z
      .string()
      .nonempty({ message: t?.ageGroupRequired || "Age group is required" }),
    country: z
      .string()
      .nonempty({ message: t?.countryRequired || "Country is required" }),
    introduction: z
      .string()
      .nonempty({ message: t?.introductionRequired || "Introduction is required" })
      .min(10, { message: t?.introductionMin || "Introduction must be at least 10 characters" })
      .max(500, { message: t?.introductionMax || "Introduction must be less than 500 characters" }),
  });
};

export const FormEditProfileSchema = createFormEditProfileSchema();
export type FormEditProfileType = z.infer<ReturnType<typeof createFormEditProfileSchema>>;

export const createFormChangePasswordSchema = (t?: UserValidationMessages) => {
  return z
    .object({
      currentPassword: z
        .string()
        .nonempty({ message: t?.currentPasswordRequired || "Current password is required" })
        .min(6, { message: t?.currentPasswordMin || "Password must be at least 6 characters" }),
      newPassword: z
        .string()
        .nonempty({ message: t?.newPasswordRequired || "New password is required" })
        .min(6, { message: t?.newPasswordMin || "Password must be at least 6 characters" })
        .max(128, { message: t?.newPasswordMax || "Password must be less than 128 characters" }),
      confirmPassword: z
        .string()
        .nonempty({ message: t?.confirmPasswordRequired || "Please confirm your password" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t?.passwordsDoNotMatch || "Passwords do not match",
      path: ["confirmPassword"],
    });
};

export const FormChangePasswordSchema = createFormChangePasswordSchema();
export type FormChangePasswordType = z.infer<ReturnType<typeof createFormChangePasswordSchema>>;

