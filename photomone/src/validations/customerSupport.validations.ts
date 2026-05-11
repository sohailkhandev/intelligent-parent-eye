import { z } from "zod";

interface CustomerSupportValidationMessages {
  nameRequired?: string;
  nameMin?: string;
  nameMax?: string;
  emailRequired?: string;
  emailInvalid?: string;
  subjectRequired?: string;
  subjectMin?: string;
  subjectMax?: string;
  messageRequired?: string;
  messageMin?: string;
  messageMax?: string;
}

export const createFormCustomerSupportSchema = (t?: CustomerSupportValidationMessages) => {
  return z.object({
    name: z
      .string()
      .nonempty({ message: t?.nameRequired || "Name is required" })
      .min(2, { message: t?.nameMin || "Name must be at least 2 characters" })
      .max(100, { message: t?.nameMax || "Name must be less than 100 characters" }),
    email: z
      .string()
      .nonempty({ message: t?.emailRequired || "Email is required" })
      .email({ message: t?.emailInvalid || "Please enter a valid email address" }),
    subject: z
      .string()
      .nonempty({ message: t?.subjectRequired || "Subject is required" })
      .min(3, { message: t?.subjectMin || "Subject must be at least 3 characters" })
      .max(200, { message: t?.subjectMax || "Subject must be less than 200 characters" }),
    message: z
      .string()
      .nonempty({ message: t?.messageRequired || "Message is required" })
      .min(10, { message: t?.messageMin || "Message must be at least 10 characters" })
      .max(5000, { message: t?.messageMax || "Message must be less than 5000 characters" }),
  });
};

export const FormCustomerSupportSchema = createFormCustomerSupportSchema();
export type FormCustomerSupportType = z.infer<ReturnType<typeof createFormCustomerSupportSchema>>;
