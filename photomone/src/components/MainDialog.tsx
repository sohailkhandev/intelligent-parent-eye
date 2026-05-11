import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { ReactNode } from "react";
import { COLORS } from "@constants";

interface MainDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  disableClose?: boolean;
  /** Hide the close (X) button in the header */
  hideCloseButton?: boolean;
  /** Center the title and subtitle in the header */
  centerTitle?: boolean;
}

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke={COLORS.generalText}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MainDialog = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "md",
  fullWidth = true,
  disableClose = false,
  hideCloseButton = false,
  centerTitle = false,
}: MainDialogProps) => {
  const maxWidthMap = {
    xs: "350px",
    sm: "500px",
    md: "688px",
    lg: "900px",
    xl: "1200px",
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (disableClose) return;
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          (event as React.MouseEvent).stopPropagation();
        }
        onClose();
      }}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      className="z-[1400]"
      disableRestoreFocus
      disableEscapeKeyDown={disableClose}
      PaperProps={{
        className:
          "!rounded-[20px] !z-[1400] overflow-hidden py-4 px-4 lg:px-6 !mx-[16px] !w-[calc(100%-32px)] ",
        sx: {
          backgroundColor: COLORS.white,
          maxWidth: maxWidthMap[maxWidth],
          maxHeight: "90vh",
          boxShadow: "0px 10px 40px rgba(0,0,0,0.12)",
          margin: "16px 24px",
        },
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <DialogTitle
        className="!flex !justify-between !items-start !text-left !p-0 !pb-3"
        sx={{
          borderBottom: `1px solid ${COLORS.border}`,
          ...(centerTitle && { justifyContent: "center", textAlign: "center" }),
        }}
      >
        <Box
          className="flex-1 min-w-0"
          sx={
            centerTitle
              ? {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }
              : undefined
          }
        >
          <Typography
            variant="h5"
            component="h5"
            className={`!font-bold !text-xl !font-proxima !text-[${COLORS.generalText}]`}
          >
            {title}
          </Typography>
          {subtitle != null && (
            <Typography
              variant="body2"
              sx={{ color: COLORS.grayStrong, mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {!disableClose && !hideCloseButton && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            size="small"
            sx={{
              color: COLORS.generalText,
              "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent className="!overflow-y-auto min-h-[200px] dialog-content-hide-scrollbar !p-0">
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default MainDialog;
