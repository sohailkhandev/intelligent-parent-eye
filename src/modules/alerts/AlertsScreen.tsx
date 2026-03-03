import { Box } from "@mui/material";
import { COLORS } from "@constants";

export const AlertsScreen = () => {
  const placeholderAlerts = [
    { id: "1", type: "Usage", message: "Screen time limit reached for today.", time: "Today, 2:30 PM", read: false },
    { id: "2", type: "Activity", message: "New app installed on connected device.", time: "Yesterday, 5:15 PM", read: true },
    { id: "3", type: "Safety", message: "Web filter triggered — blocked site visited.", time: "Mar 2, 10:00 AM", read: true },
  ];

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
        {placeholderAlerts.length === 0 ? (
          <Box className="p-8 text-center" style={{ color: COLORS.generalText, opacity: 0.8 }}>
            No alerts yet.
          </Box>
        ) : (
          placeholderAlerts.map((alert) => (
            <Box
              key={alert.id}
              className="flex items-start gap-4 p-4"
              sx={{
                borderBottom: `1px solid ${COLORS.border}`,
                backgroundColor: alert.read ? COLORS.white : `${COLORS.primary}08`,
              }}
            >
              <span
                className="text-xs font-medium px-2 py-1 rounded shrink-0"
                style={{
                  backgroundColor: `${COLORS.secondary}22`,
                  color: COLORS.secondary,
                }}
              >
                {alert.type}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: COLORS.generalText }}>
                  {alert.message}
                </p>
                <p className="text-xs mt-0.5" style={{ color: COLORS.generalText, opacity: 0.6 }}>
                  {alert.time}
                </p>
              </div>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};
