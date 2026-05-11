import { Box, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { COLORS } from "@constants";
import { MainButton } from "@components";
import { FormInput } from "../../auth/components/FormInput";
import { PowerTesterApis } from "@apis";
import { useAppContext } from "@providers";

// /** Replace with your official PhotoMone overview video ID when available */
// const YOUTUBE_EMBED_ID = "M7lc1UVf-VE";

const QUICK_FACTS = [
  {
    label: "Eligibility",
    text: "TikTok or Instagram account required.",
  },
  {
    label: "Reward",
    text: "1,000 Points (approx. $100) if selected. 100 spots total.",
  },
  {
    label: "Apply",
    text: "Email and TikTok or Instagram ID in the form below.",
  },
] as const;

const powerTesterFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  socialHandle: z
    .string()
    .min(2, "Enter your TikTok or Instagram username or profile link")
    .max(2000, "Text is too long"),
});

type PowerTesterForm = z.infer<typeof powerTesterFormSchema>;

const bodySx = {
  color: COLORS.textDark,
  lineHeight: 1.65,
  fontSize: { xs: "0.9375rem", lg: "1rem" },
};

const sectionTitleSx = {
  fontFamily: '"Montserrat", sans-serif',
  fontWeight: 700,
  color: COLORS.generalText,
  fontSize: { xs: "1.05rem", lg: "1.125rem" },
  marginTop: "1.25rem",
  marginBottom: "0.5rem",
};

function QuickFactCards({
  className = "",
  direction = "grid",
}: {
  className?: string;
  direction?: "grid" | "stack";
}) {
  return (
    <Box
      className={
        direction === "grid"
          ? `grid grid-cols-1 sm:grid-cols-3 gap-3 ${className}`
          : `flex flex-col gap-3 ${className}`
      }
    >
      {QUICK_FACTS.map((card) => (
        <Box
          key={card.label}
          className="rounded-xl border p-3 sm:p-3.5"
          sx={{
            borderColor: `${COLORS.primary}40`,
            backgroundColor: COLORS.white,
          }}
        >
          <Typography
            className="text-xs font-bold uppercase tracking-wide mb-1"
            sx={{ color: COLORS.primary }}
          >
            {card.label}
          </Typography>
          <Typography
            className="text-sm leading-snug"
            sx={{ color: COLORS.textDark }}
          >
            {card.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export const PowerTesterPost = () => {
  const { showToast } = useAppContext();
  const submitMutation = PowerTesterApis.useSubmitPowerTesterApplication();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PowerTesterForm>({
    resolver: zodResolver(powerTesterFormSchema),
    defaultValues: { email: "", socialHandle: "" },
  });

  const socialField = register("socialHandle");

  const onSubmit = (values: PowerTesterForm) => {
    submitMutation.mutate(
      {
        email: values.email,
        socialMediaUrl: values.socialHandle,
      },
      {
        onSuccess: (data) => {
          const msg =
            data?.message?.trim() ||
            "Thank you. Your Power Tester application has been submitted. We will review and contact you if selected.";
          showToast(msg, "success");
          reset();
        },
        onError: (err) => {
          showToast(
            err instanceof Error
              ? err.message
              : "Something went wrong. Please try again.",
            "error"
          );
        },
      }
    );
  };

  const formBlock = (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-xl border p-4 sm:p-5 w-full max-w-xl"
      sx={{
        borderColor: COLORS.primary,
        boxShadow: `0 6px 24px -10px ${COLORS.primary}55`,
      }}
      noValidate
    >
      <label htmlFor="pt-email" className="sr-only">
        Email
      </label>
      <FormInput
        id="pt-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email"
        required
        register={register("email")}
        error={errors.email?.message}
        variant="underline"
      />
      <TextField
        id="pt-social"
        fullWidth
        placeholder="TikTok or Instagram — URL or @username"
        name={socialField.name}
        onChange={socialField.onChange}
        onBlur={socialField.onBlur}
        inputRef={socialField.ref}
        inputProps={{ "aria-label": "TikTok or Instagram profile" }}
        error={!!errors.socialHandle}
        helperText={errors.socialHandle?.message}
        variant="outlined"
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
          },
        }}
      />
      <MainButton
        type="submit"
        disabled={submitMutation.isPending}
        className="!normal-case w-fit"
      >
        {submitMutation.isPending ? "Submitting…" : "Submit"}
      </MainButton>
    </Box>
  );

  return (
    <Box
      className="w-full max-w-[1280px] mx-auto pb-10 md:pb-12 px-4 sm:px-6 lg:px-10 xl:px-12"
      sx={{ color: COLORS.generalText }}
    >
      <Box className="flex flex-col lg:flex-row lg:items-start lg:gap-10 xl:gap-14">
        <Box
          component="main"
          className="flex-1 min-w-0 w-full space-y-5 lg:space-y-6 max-w-[720px] lg:max-w-none"
        >
          <Typography
            component="h2"
            sx={{ ...sectionTitleSx, marginTop: 0, fontSize: { xs: "1.2rem", lg: "1.35rem" } }}
          >
            Discover &amp; Earn with AI-Generated Photos
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            <Typography component="p" sx={{ ...bodySx, mb: 0 }}>
              Welcome to PhotoMone — the AI-powered photo trading platform.
            </Typography>
            <Typography component="p" sx={{ ...bodySx, mb: 0 }}>
              The days of laughing at strange AI-generated images are behind us.
            </Typography>
            <Typography component="p" sx={{ ...bodySx, mb: 0 }}>
              We&apos;re entering a new era where artificial intelligence creates
              real value from photos.
            </Typography>
            <Typography component="p" sx={{ ...bodySx, mb: 0 }}>
              Stay ahead of the curve—before the world catches on.
            </Typography>
            <Typography component="p" sx={{ ...bodySx, mb: 0 }}>
              Transform your photos into unique AI-generated digital assets and
              unlock new revenue opportunities.
            </Typography>
          </Box>

          <Box className="lg:hidden">
            <QuickFactCards direction="grid" className="my-1" />
          </Box>

          <Typography component="h2" sx={{ ...sectionTitleSx, marginTop: 0 }}>
            Join as a Power Tester
          </Typography>
          <Typography component="p" sx={{ ...bodySx, mb: 1.25 }}>
            PhotoMone is now recruiting Power Testers to explore our AI-powered
            photo marketplace.
          </Typography>
          <Typography component="p" sx={{ ...bodySx, mb: 1.25 }}>
            Only users with TikTok or Instagram accounts are eligible.
          </Typography>
          <Typography component="p" sx={{ ...bodySx, mb: 1.25 }}>
            100 Power Testers will be selected. Recruitment closes once all spots
            are filled.
          </Typography>
          <Typography component="p" sx={{ ...bodySx, mb: 0 }}>
            Selected users will receive 1,000 Points (approx. $100) credited to
            their account.
          </Typography>

          <Typography component="h2" sx={sectionTitleSx}>
            How to Apply
          </Typography>
          <Typography component="p" sx={{ ...bodySx, mb: 0 }}>
            Enter your email address and TikTok or Instagram ID in the application
            form at the bottom of this page.
          </Typography>

          <Typography component="h2" sx={sectionTitleSx}>
            Redemption Policy
          </Typography>
          <Typography component="p" sx={{ ...bodySx, mb: 1.25 }}>
            Power Testers can redeem gift cards after May 15 (official launch
            date).
          </Typography>
          <Typography component="p" sx={{ ...bodySx, mb: 1.25 }}>
            Gift card redemption is only available using Credits, which are earned
            by claiming accumulated points from photos.
          </Typography>
          <Typography component="p" sx={{ ...bodySx, mb: 0 }}>
            Bonus points provided during the promotion cannot be used for gift card
            redemption.
          </Typography>

          <Typography component="h2" sx={sectionTitleSx}>
            Credit System
          </Typography>
          <Typography component="p" sx={{ ...bodySx, mb: 1.25 }}>
            Claimed points from photos are converted into Credits.
          </Typography>
          <Typography component="p" sx={{ ...bodySx, mb: 1.25 }}>
            Credits are the points eligible for gift card redemption.
          </Typography>
          <Typography component="p" sx={{ ...bodySx, mb: 0 }}>
            On the main screen, display Points, Credits, and Locky in three separate
            sections.
          </Typography>

          <Typography component="h2" sx={sectionTitleSx}>
            Additional Notes
          </Typography>
          <Typography component="p" sx={{ ...bodySx, mb: 1.25 }}>
            Participation is strictly limited to 100 users.
          </Typography>
          <Typography component="p" sx={{ ...bodySx, mb: 1.25 }}>
            Once all spots are filled, applications will close.
          </Typography>
          <Typography component="p" sx={{ ...bodySx, mb: 0 }}>
            Power Testers get early access to explore PhotoMone, trade photos in
            real time, and experience the AI-powered marketplace.
          </Typography>

          {/* Video section — re-enable when ready
          <Typography component="h2" sx={sectionTitleSx}>
            Video
          </Typography>
          <Box
            className="relative w-full overflow-hidden rounded-xl border shadow-sm"
            sx={{
              borderColor: COLORS.border,
              aspectRatio: "16 / 9",
              maxWidth: { lg: "100%" },
            }}
          >
            <iframe
              title="PhotoMone — reference video"
              src={`https://www.youtube.com/embed/${YOUTUBE_EMBED_ID}`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </Box>
          <Typography variant="caption" className="block mt-1.5 text-[#758599]">
            Reference video for context.
          </Typography>
          */}

          <Typography
            component="h2"
            id="apply"
            sx={{ ...sectionTitleSx, marginTop: "1.75rem" }}
          >
            Apply now
          </Typography>
          {formBlock}
        </Box>

        <Box
          component="aside"
          className="hidden lg:flex flex-col w-full lg:w-[min(100%,340px)] xl:w-[360px] shrink-0 lg:sticky lg:top-24 lg:self-start gap-4 rounded-2xl border p-5 xl:p-6"
          sx={{
            borderColor: `${COLORS.primary}35`,
            background: `linear-gradient(180deg, ${COLORS.white} 0%, ${COLORS.primary}0D 100%)`,
            boxShadow: `0 12px 40px -20px ${COLORS.primary}40`,
          }}
          aria-label="At a glance"
        >
          <Typography
            component="p"
            className="font-montserrat font-bold text-sm uppercase tracking-wider"
            sx={{ color: COLORS.primary }}
          >
            At a glance
          </Typography>
          <QuickFactCards direction="stack" />
          <Typography
            variant="caption"
            sx={{ color: COLORS.grayStrong, lineHeight: 1.5 }}
          >
            The application form is in the main column on the left.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
