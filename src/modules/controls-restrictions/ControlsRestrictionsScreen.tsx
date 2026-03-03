import { Box } from "@mui/material";
import { IChild } from "@types";
import { COLORS } from "@constants";

interface ControlsRestrictionsScreenProps {
  children: IChild[];
  isLoading: boolean;
}

export const ControlsRestrictionsScreen = ({
  children,
  isLoading,
}: ControlsRestrictionsScreenProps) => {
  if (isLoading) {
    return (
      <Box className="flex items-center justify-center py-20">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: COLORS.primary }}
        />
      </Box>
    );
  }

  return (
    <Box className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: COLORS.generalText }}>
          Controls / Restrictions
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: COLORS.generalText, opacity: 0.7 }}
        >
          Manage screen time, app access, and content filters per child
        </p>
      </div>

      {children.length === 0 ? (
        <Box
          className="rounded-xl p-8 text-center"
          sx={{ border: `1px dashed ${COLORS.border}` }}
        >
          <p style={{ color: COLORS.generalText, opacity: 0.8 }}>
            Connect a child&apos;s device first to set controls and restrictions.
          </p>
        </Box>
      ) : (
        <div className="space-y-4">
          {children.map((child) => (
            <Box
              key={child._id}
              className="rounded-xl p-5"
              sx={{
                backgroundColor: COLORS.white,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <p
                className="font-semibold"
                style={{ color: COLORS.generalText }}
              >
                {child.name}
              </p>
              <p className="text-sm mt-0.5" style={{ color: COLORS.generalText, opacity: 0.7 }}>
                Age group: {child.ageGroup}
              </p>
              <div className="mt-4 pt-4 grid gap-3 sm:grid-cols-2" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: `${COLORS.primary}10` }}>
                  <span className="text-sm" style={{ color: COLORS.generalText }}>Screen time limit</span>
                  <span className="text-sm font-medium" style={{ color: COLORS.primary }}>Not set</span>
                </div>
                <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: `${COLORS.primary}10` }}>
                  <span className="text-sm" style={{ color: COLORS.generalText }}>App restrictions</span>
                  <span className="text-sm font-medium" style={{ color: COLORS.primary }}>Manage</span>
                </div>
                <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: `${COLORS.primary}10` }}>
                  <span className="text-sm" style={{ color: COLORS.generalText }}>Web filter</span>
                  <span className="text-sm font-medium" style={{ color: COLORS.primary }}>Off</span>
                </div>
                <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: `${COLORS.primary}10` }}>
                  <span className="text-sm" style={{ color: COLORS.generalText }}>Bedtime schedule</span>
                  <span className="text-sm font-medium" style={{ color: COLORS.primary }}>Not set</span>
                </div>
              </div>
            </Box>
          ))}
        </div>
      )}
    </Box>
  );
};
