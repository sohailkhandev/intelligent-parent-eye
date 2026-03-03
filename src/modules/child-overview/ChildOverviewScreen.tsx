import { Box } from "@mui/material";
import { IChild } from "@types";
import { COLORS } from "@constants";

interface ChildOverviewScreenProps {
  children: IChild[];
  isLoading: boolean;
}

export const ChildOverviewScreen = ({
  children,
  isLoading,
}: ChildOverviewScreenProps) => {
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
          Child Overview
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: COLORS.generalText, opacity: 0.7 }}
        >
          Summary of your connected children and their activity
        </p>
      </div>

      {children.length === 0 ? (
        <Box
          className="rounded-xl p-8 text-center"
          sx={{ border: `1px dashed ${COLORS.border}` }}
        >
          <p style={{ color: COLORS.generalText, opacity: 0.8 }}>
            No children connected yet. Use your connection code on the
            child&apos;s app to link a device.
          </p>
        </Box>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <Box
              key={child._id}
              className="rounded-xl p-5"
              sx={{
                backgroundColor: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                boxShadow: `0 2px 8px ${COLORS.border}`,
              }}
            >
              <p
                className="font-semibold text-lg"
                style={{ color: COLORS.generalText }}
              >
                {child.name}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: COLORS.generalText, opacity: 0.8 }}
              >
                Age group: {child.ageGroup}
              </p>
              <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${COLORS.primary}22`,
                    color: COLORS.primary,
                  }}
                >
                  Connected
                </span>
              </div>
            </Box>
          ))}
        </div>
      )}
    </Box>
  );
};
