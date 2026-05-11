import { Box } from "@mui/material";
import { MainCard, SubHeading } from "@components";
import { COLORS } from "@constants";

type VerificationStatus = "pending" | "success" | "error";

interface VerifyEmailScreenProps {
  status: VerificationStatus;
  title: string;
  message: string;
  helperText?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const STATUS_CONFIG: Record<
  VerificationStatus,
  {
    accent: string;
    softAccent: string;
    icon: string;
    label: string;
  }
> = {
  pending: {
    accent: COLORS.primary,
    softAccent: `${COLORS.primary}18`,
    icon: "...",
    label: "Verifying your email",
  },
  success: {
    accent: COLORS.primary,
    softAccent: `${COLORS.primary}18`,
    icon: "✓",
    label: "Email verified",
  },
  error: {
    accent: COLORS.secondary,
    softAccent: `${COLORS.secondary}18`,
    icon: "!",
    label: "Verification failed",
  },
};

export const VerifyEmailScreen = ({
  status,
  title,
  message,
  helperText,
  actionLabel,
  onAction,
}: VerifyEmailScreenProps) => {
  const config = STATUS_CONFIG[status];
  const isPending = status === "pending";

  return (
    <Box
      className="w-full px-4 flex flex-col min-h-[calc(100vh-8rem)] items-center justify-center"
      sx={{ minHeight: "calc(100vh - 8rem)" }}
    >
      <MainCard className="max-w-[440px]">
        <Box className="flex flex-col items-center text-center gap-4">
          <Box
            className="relative flex items-center justify-center"
            sx={{
              width: 92,
              height: 92,
              animation: "float-y 4s ease-in-out infinite",
            }}
          >
            <Box
              className="absolute inset-0 rounded-full"
              sx={{
                background: `radial-gradient(circle, ${config.softAccent} 0%, transparent 70%)`,
                animation: "pulse-ring 2.2s ease-in-out infinite",
              }}
            />
            <Box
              className="relative z-10 flex items-center justify-center rounded-full text-3xl font-semibold"
              sx={{
                width: 72,
                height: 72,
                color: config.accent,
                backgroundColor: config.softAccent,
                border: `1px solid ${config.accent}30`,
                boxShadow: `0 16px 30px ${config.accent}18`,
              }}
            >
              {config.icon}
            </Box>

            {isPending && (
              <Box
                className="absolute rounded-full"
                sx={{
                  width: 88,
                  height: 88,
                  border: `1px dashed ${config.accent}50`,
                  animation: "spin 5s linear infinite",
                }}
              />
            )}
          </Box>

          <Box
            className="rounded-full px-3 py-1 text-xs font-medium tracking-[0.18em] uppercase"
            sx={{
              color: config.accent,
              backgroundColor: config.softAccent,
              border: `1px solid ${config.accent}20`,
            }}
          >
            {config.label}
          </Box>

          <Box className="space-y-2">
            <SubHeading title={title} className="text-center" />
            <p
              className="m-0 text-sm leading-6"
              style={{ color: COLORS.generalText, opacity: 0.78 }}
            >
              {message}
            </p>
          </Box>

          {helperText && (
            <Box
              className="w-full rounded-xl px-4 py-3 text-sm"
              sx={{
                color: config.accent,
                backgroundColor: config.softAccent,
                border: `1px solid ${config.accent}20`,
              }}
            >
              {helperText}
            </Box>
          )}

          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="w-full mt-2 py-3 px-4 text-sm font-medium rounded-lg transition-opacity hover:opacity-90"
              style={{
                color: COLORS.white,
                background: config.accent,
              }}
            >
              {actionLabel}
            </button>
          )}
        </Box>
      </MainCard>
    </Box>
  );
};

export default VerifyEmailScreen;
