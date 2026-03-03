import { Box } from "@mui/material";
import { useAuthContext } from "@providers";
import { COLORS } from "@constants";

export const SettingsScreen = () => {
  const { authUser } = useAuthContext();

  return (
    <Box className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: COLORS.generalText }}>
          Settings
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: COLORS.generalText, opacity: 0.7 }}
        >
          Account and app preferences
        </p>
      </div>

      <Box
        className="rounded-xl p-5 max-w-xl"
        sx={{
          backgroundColor: COLORS.white,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <h2 className="text-base font-semibold mb-4" style={{ color: COLORS.generalText }}>
          Profile
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between py-2" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <span className="text-sm" style={{ color: COLORS.generalText, opacity: 0.8 }}>Full name</span>
            <span className="text-sm font-medium" style={{ color: COLORS.generalText }}>{authUser?.fullName ?? "—"}</span>
          </div>
          <div className="flex justify-between py-2" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <span className="text-sm" style={{ color: COLORS.generalText, opacity: 0.8 }}>Email</span>
            <span className="text-sm font-medium" style={{ color: COLORS.generalText }}>{authUser?.email ?? "—"}</span>
          </div>
          <div className="flex justify-between py-2" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <span className="text-sm" style={{ color: COLORS.generalText, opacity: 0.8 }}>Connection code</span>
            <span className="text-sm font-medium" style={{ color: COLORS.primary }}>{authUser?.code ?? "—"}</span>
          </div>
        </div>
      </Box>

      <Box
        className="rounded-xl p-5 max-w-xl"
        sx={{
          backgroundColor: COLORS.white,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <h2 className="text-base font-semibold mb-4" style={{ color: COLORS.generalText }}>
          Notifications
        </h2>
        <p className="text-sm" style={{ color: COLORS.generalText, opacity: 0.8 }}>
          Configure how you receive alerts (email, push). Coming soon.
        </p>
      </Box>
    </Box>
  );
};
