import { AppsOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import { COLORS } from "@constants";
import { IAlert } from "@types";

interface AlertsScreenProps {
  alerts: IAlert[];
  isLoading: boolean;
}

const formatReportingDate = (value: string) => {
  try {
    return new Date(value).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

export const AlertsScreen = ({ alerts, isLoading }: AlertsScreenProps) => {
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
          Alerts
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: COLORS.generalText, opacity: 0.7 }}
        >
          Notifications and alerts from your children&apos;s activity
        </p>
      </div>

      <Box
        className="rounded-xl overflow-hidden"
        sx={{
          border: `1px solid ${COLORS.border}`,
          backgroundColor: COLORS.white,
        }}
      >
        {alerts.length === 0 ? (
          <Box className="p-8 text-center" style={{ color: COLORS.generalText, opacity: 0.8 }}>
            No alerts yet.
          </Box>
        ) : (
          alerts.map((alert, index) => (
            <Box
              key={alert._id}
              className="p-5"
              sx={{
                borderBottom:
                  index === alerts.length - 1 ? "none" : `1px solid ${COLORS.border}`,
                backgroundColor: index % 2 === 0 ? COLORS.white : `${COLORS.primary}08`,
              }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded shrink-0"
                        style={{
                          backgroundColor: `${COLORS.secondary}22`,
                          color: COLORS.secondary,
                        }}
                      >
                        Usage Alert
                      </span>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded shrink-0"
                        style={{
                          backgroundColor: `${COLORS.primary}22`,
                          color: COLORS.primary,
                        }}
                      >
                        {alert.hours} hour limit
                      </span>
                    </div>

                    <p
                      className="text-base font-semibold mt-3"
                      style={{ color: COLORS.generalText }}
                    >
                      {alert.childName} crossed the {alert.hours}-hour usage threshold
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: COLORS.generalText, opacity: 0.7 }}
                    >
                      Reporting day started on {formatReportingDate(alert.reportingDayStart)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {alert.apps.map((app) => (
                    <Box
                      key={app._id}
                      className="flex items-center gap-3 rounded-xl p-3"
                      sx={{
                        backgroundColor: COLORS.white,
                        border: `1px solid ${COLORS.border}`,
                      }}
                    >
                      {app.icon ? (
                        <img
                          src={app.icon}
                          alt={app.appName}
                          className="w-11 h-11 rounded-xl object-cover"
                        />
                      ) : (
                        <Box
                          className="w-11 h-11 rounded-xl flex items-center justify-center"
                          sx={{
                            backgroundColor: `${COLORS.primary}18`,
                            color: COLORS.primary,
                          }}
                        >
                          <AppsOutlined fontSize="small" />
                        </Box>
                      )}

                      <div className="min-w-0 flex-1">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: COLORS.generalText }}
                        >
                          {app.appName}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: COLORS.generalText, opacity: 0.65 }}
                        >
                          Used for {app.usage}
                        </p>
                      </div>
                    </Box>
                  ))}
                </div>
              </div>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};
