import { AppsOutlined, Close } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { COLORS } from "@constants";
import { useAuthContext } from "@providers";
import { SocketService } from "@services";
import type { AlertAppsUsageSocketPayload } from "@types";

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

export const SocketAlertHandler = () => {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuthContext();
  const [alertPayload, setAlertPayload] =
    useState<AlertAppsUsageSocketPayload | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      SocketService.setAlertAppsUsageDialogCallback(null);
      setOpen(false);
      setAlertPayload(null);
      return;
    }

    SocketService.setAlertAppsUsageDialogCallback((payload) => {
      setAlertPayload(payload);
      setOpen(true);
      void queryClient.invalidateQueries({ queryKey: ["alerts"] });
    });

    return () => {
      SocketService.setAlertAppsUsageDialogCallback(null);
    };
  }, [isLoggedIn, queryClient]);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          border: `1px solid ${COLORS.border}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <Box>
          <Box
            component="p"
            sx={{
              m: 0,
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: COLORS.secondary,
              fontWeight: 600,
            }}
          >
            Live Usage Alert
          </Box>
          <Box
            component="h2"
            sx={{
              m: 0,
              mt: 0.75,
              fontSize: "1.5rem",
              color: COLORS.generalText,
              fontWeight: 700,
            }}
          >
            {alertPayload?.childName ?? "Child activity update"}
          </Box>
        </Box>

        <IconButton onClick={() => setOpen(false)}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {alertPayload && (
          <Box className="space-y-5">
            <Box
              className="rounded-2xl p-4"
              sx={{
                backgroundColor: `${COLORS.secondary}10`,
                border: `1px solid ${COLORS.secondary}20`,
              }}
            >
              <Box
                component="p"
                sx={{
                  m: 0,
                  color: COLORS.generalText,
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                }}
              >
                {alertPayload.childName} has crossed the{" "}
                <strong>{alertPayload.hours}-hour</strong> usage threshold.
              </Box>
              <Box
                component="p"
                sx={{
                  m: 0,
                  mt: 1,
                  color: COLORS.generalText,
                  opacity: 0.7,
                  fontSize: "0.85rem",
                }}
              >
                Reporting day started on{" "}
                {formatReportingDate(alertPayload.reportingDayStart)}
              </Box>
            </Box>

            <Box className="space-y-3">
              {alertPayload.apps.map((app, index) => (
                <Box
                  key={`${alertPayload.childId}-${app.appName}-${index}`}
                  className="flex items-center gap-3 rounded-xl p-3"
                  sx={{
                    backgroundColor:
                      index % 2 === 0 ? COLORS.white : `${COLORS.primary}08`,
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

                  <Box className="flex-1 min-w-0">
                    <Box
                      component="p"
                      sx={{
                        m: 0,
                        color: COLORS.generalText,
                        fontWeight: 600,
                        fontSize: "0.95rem",
                      }}
                    >
                      {app.appName}
                    </Box>
                    <Box
                      component="p"
                      sx={{
                        m: 0,
                        mt: 0.5,
                        color: COLORS.generalText,
                        opacity: 0.68,
                        fontSize: "0.82rem",
                      }}
                    >
                      Used for {app.usage}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SocketAlertHandler;
