import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormContainer, MainButton, ValidatedTextarea } from "@components";
import { FormInput } from "../../auth/components/FormInput";
import { CustomerSupportValidations } from "@validations";
import { CustomerSupportApis } from "@apis";
import { useAppContext, useLanguage } from "@providers";
import { COLORS } from "@constants";
import { PaperclipIcon } from "@assets/icons/svg";
import authBg from "@assets/images/authBg.jpg";

export const CustomerSupportScreen = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { translations } = useLanguage();

  const t = translations || {};
  const cs = t.customerSupport || {};
  const form = cs.form || {};
  const validation = cs.validation || {};

  const sendMessageMutation =
    CustomerSupportApis.useSendCustomerSupportMessage();
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportSchema =
    CustomerSupportValidations.createFormCustomerSupportSchema(validation);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<CustomerSupportValidations.FormCustomerSupportType>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const goBack = () => {
    navigate(-1);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files?.length) setAttachment(files[0]);
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (
    values: CustomerSupportValidations.FormCustomerSupportType
  ) => {
    try {
      sendMessageMutation.mutate({
        name: values.name,
        email: values.email,
        subject: values.subject,
        message: values.message,
        attachment: attachment ?? undefined,
      });
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  useEffect(() => {
    if (sendMessageMutation.isSuccess) {
      showToast(
        form.messageSent ||
          "Message sent successfully! We'll get back to you soon.",
        "success"
      );
      reset();
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    if (sendMessageMutation.isError) {
      const error = sendMessageMutation.error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        error?.response?.data?.message ||
        error?.message ||
        form.messageFailed ||
        "Failed to send message. Please try again.";
      showToast(message, "error");
    }
  }, [
    sendMessageMutation.isSuccess,
    sendMessageMutation.isError,
    sendMessageMutation.error,
    reset,
    showToast,
    form,
  ]);

  return (
    <Box
      className="flex flex-col items-center justify-center px-4  py-30"
      sx={{
        backgroundImage: `url(${authBg})`,
        backgroundSize: "100% 100%",
      }}
    >
      <FormContainer
        title={cs.title || "Customer Support"}
        onClose={goBack}
        className="max-w-[900px]"
      >
        <Box
          component="form"
          className="flex flex-col gap-5 mt-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormInput
            id="name"
            name="name"
            type="text"
            label={form.name || "Name*"}
            placeholder={form.namePlaceholder || "Enter your full name"}
            register={register("name")}
            error={errors.name?.message}
            variant="underline"
          />

          <FormInput
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            label={form.email || "Email*"}
            placeholder={form.emailPlaceholder || "Enter the e-mail"}
            register={register("email")}
            error={errors.email?.message}
            variant="underline"
          />

          <FormInput
            id="subject"
            name="subject"
            type="text"
            label={form.subject || "Subject*"}
            placeholder={form.subjectPlaceholder || "Enter the subject"}
            register={register("subject")}
            error={errors.subject?.message}
            variant="underline"
          />

          <ValidatedTextarea
            id="message"
            name="message"
            rows={5}
            label={form.message || "Message*"}
            placeholder={form.messagePlaceholder || "Enter your message..."}
            register={register("message")}
            error={errors.message?.message}
            variant="underline"
          />

          {/* Add an Attachment - paperclip icon + text */}
          <Box>
            <input
              id="attachments"
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
            />
            <Box
              component="button"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0 focus:outline-none"
              sx={{ color: COLORS.generalText }}
            >
              <PaperclipIcon />
              <Typography className="!font-proxima !font-medium !text-sm lg:!text-base">
                {form.addAttachment || "Add an Attachment"}
              </Typography>
            </Box>
            {attachment && (
              <Box className="mt-2 flex items-center gap-2 inline-block">
                <Box
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 flex-1 min-w-0"
                  sx={{ backgroundColor: COLORS.grayLight }}
                >
                  <Typography
                    className="!font-proxima !text-sm truncate"
                    sx={{ color: COLORS.generalText }}
                  >
                    {attachment.name}
                  </Typography>
                  <Box
                    component="button"
                    type="button"
                    onClick={removeAttachment}
                    className="p-0 min-w-0 border-0 bg-transparent cursor-pointer flex-shrink-0"
                    sx={{ color: COLORS.secondary }}
                    aria-label={
                      form.removeFileAriaLabel || "Remove file"
                    }
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          <MainButton
            type="submit"
            className="w-full !mt-2"
            disabled={sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending
              ? form.sending || "Sending..."
              : form.sendMessage || "Send Message"}
          </MainButton>

          <Typography
            className="!font-proxima !text-sm text-center"
            sx={{ color: COLORS.grayDark }}
          >
            {cs.responseTime || "We typically respond within 24-48 hours."}
          </Typography>
        </Box>
      </FormContainer>
    </Box>
  );
};

export default CustomerSupportScreen;
