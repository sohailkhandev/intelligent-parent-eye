import { Box } from "@mui/material";
import { COLORS } from "@constants";
import { ValidatedInput } from "@components";

interface SettingsScreenProps {
  connectionCode: string;
  email: string;
  fullName: string;
  fullNameError: string | null;
  isSaveDisabled: boolean;
  isSubmitting: boolean;
  onFullNameChange: (value: string) => void;
  onSubmit: () => void;
}

export const SettingsScreen = ({
  connectionCode,
  email,
  fullName,
  fullNameError,
  isSaveDisabled,
  isSubmitting,
  onFullNameChange,
  onSubmit,
}: SettingsScreenProps) => {
  return (
    <Box className="space-y-8 max-w-4xl">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: COLORS.generalText }}
        >
          Settings
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: COLORS.generalText, opacity: 0.7 }}
        >
          Update your parent account details and keep your profile information current.
        </p>
      </div>

      <Box
        className="rounded-2xl p-6 lg:p-8"
        sx={{
          backgroundColor: COLORS.white,
          border: `1px solid ${COLORS.border}`,
          boxShadow: `0 8px 24px ${COLORS.border}`,
          background: `linear-gradient(135deg, ${COLORS.white} 0%, ${COLORS.primary}08 100%)`,
        }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <p
              className="text-sm font-medium uppercase tracking-[0.2em] mb-2"
              style={{ color: COLORS.primary }}
            >
              Parent Profile
            </p>
            <h2
              className="text-2xl font-bold"
              style={{ color: COLORS.generalText }}
            >
              Manage your account details
            </h2>
            <p
              className="text-sm mt-2"
              style={{ color: COLORS.generalText, opacity: 0.75 }}
            >
              Only your name can be edited here. Email and connection code stay read-only for account security.
            </p>
          </div>

          <Box
            className="rounded-2xl px-4 py-3 w-full lg:max-w-[240px]"
            sx={{
              backgroundColor: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              boxShadow: `0 4px 14px ${COLORS.border}`,
            }}
          >
            <p
              className="text-xs uppercase tracking-[0.18em]"
              style={{ color: COLORS.generalText, opacity: 0.55 }}
            >
              Connection code
            </p>
            <p
              className="text-xl font-bold mt-2"
              style={{ color: COLORS.primary, letterSpacing: "0.12em" }}
            >
              {connectionCode}
            </p>
          </Box>
        </div>
      </Box>

      <Box
        className="rounded-2xl p-6 lg:p-8"
        sx={{
          backgroundColor: COLORS.white,
          border: `1px solid ${COLORS.border}`,
          boxShadow: `0 8px 24px ${COLORS.border}`,
        }}
      >
        <div className="flex flex-col gap-6">
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: COLORS.generalText }}
            >
              Edit profile
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: COLORS.generalText, opacity: 0.7 }}
            >
              Keep your displayed parent name up to date across the dashboard.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <ValidatedInput
              label="Full name"
              placeholder="Enter your full name"
              required
              value={fullName}
              onChange={onFullNameChange}
              error={!!fullNameError}
              helperText={fullNameError ?? ""}
            />

            <ValidatedInput
              label="Email"
              value={email}
              disabled
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSaveDisabled}
              className="min-w-[160px] py-3 px-5 rounded-xl text-sm font-medium transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                color: COLORS.white,
                backgroundColor: COLORS.primary,
              }}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </Box>
    </Box>
  );
};
