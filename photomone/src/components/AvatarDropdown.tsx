import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  MenuItem,
  ListItemText,
  Box,
  Typography,
  Divider,
  ListItemIcon,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { ROUTES } from "@constants";
import { useAuthContext, useAppContext, useLanguage } from "@providers";
import { useTransliterateUsername } from "@hooks";

interface AvatarDropdownProps {
  children: React.ReactNode;
  showDashboardLink?: boolean;
  // unreadNoticeCount?: number;
}

export const AvatarDropdown = ({
  children,
  showDashboardLink = false,
  // unreadNoticeCount = 0,
}: AvatarDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { showToast } = useAppContext();
  const { translations } = useLanguage();

  const t = translations || {};
  const appHeader = t.appHeader || {};
  const avatarDropdown = appHeader.avatarDropdown || {};

  // Transliterate username based on selected language
  const translatedUsername = useTransliterateUsername(authUser?.fullName);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      navigate(ROUTES.login, { replace: true });
    } catch (error: any) {
      console.error("Logout failed:", error);
      const errorMessage = error?.response?.data?.message || error?.message || avatarDropdown.logoutFailed || "Logout failed. Please try again.";
      showToast(errorMessage, "error");
      // Still close menu even if logout fails
      handleMenuClose();
    }
  };

  const handleDashboard = () => {
    navigate(ROUTES.dashboard);
    handleMenuClose();
  };

  return (
    <>
      <div onClick={handleAvatarClick} className="cursor-pointer">
        {children}
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          zIndex: 9999,
          "& .MuiPaper-root": {
            zIndex: 9999,
          },
        }}
        PaperProps={{
          className:
            "mt-2 min-w-[200px] backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden",
          sx: {
            backgroundImage: "none",
            backgroundColor: "#000000",
            border: "1px solid rgba(13, 157, 253, 0.12)",
            zIndex: 9999,
          },
        }}
      >
        {/* User Info Header */}
        <Box
          className="px-4 py-3 rounded-t-2xl"
          sx={{
            background: "linear-gradient(135deg, #7245EF 0%, #0D9DFD 100%)",
          }}
        >
          <Typography
            variant="subtitle1"
            className="text-white font-bold text-base"
          >
            {translatedUsername || appHeader.user || "User"}
          </Typography>
        </Box>

        {/* Menu Items */}
        <Box className="py-1">
          {showDashboardLink && (
            <>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDashboard();
                }}
                className="py-2 px-4 transition-all duration-200 cursor-pointer"
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(114, 69, 239, 0.15) !important",
                    backgroundImage: "none",
                  },
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
              >
                <ListItemIcon className="min-w-[40px]">
                  <DashboardIcon className="text-white text-lg" />
                </ListItemIcon>
                <ListItemText
                  primary={avatarDropdown.dashboard || "Dashboard"}
                  className="text-white font-medium"
                />
              </MenuItem>
              <Divider className="bg-[rgba(13,157,253,0.12)] my-1" />
            </>
          )}

          {/* <MenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(ROUTES.notice);
              handleMenuClose();
            }}
            className="py-2 px-4 transition-all duration-200 cursor-pointer relative"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(13, 157, 253, 0.15) !important",
                backgroundImage: "none",
              },
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          >
            <ListItemIcon className="min-w-[40px]">
              <CampaignIcon className="text-white text-lg" />
            </ListItemIcon>
            <ListItemText
              primary={avatarDropdown.notice || "Notice"}
              className="text-white font-medium"
            />
            {unreadNoticeCount > 0 && (
              <Box
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 rounded-full z-10000000"
                sx={{
                  width: "8px",
                  height: "8px",
                  minWidth: "8px",
                  minHeight: "8px",
                }}
              />
            )}
          </MenuItem> */}

          <MenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLogout().catch((error) => {
                // Ensure error is caught to prevent unhandled promise rejection
                console.error("Unhandled logout error:", error);
              });
            }}
            className="py-2 px-4 transition-all duration-200 cursor-pointer"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(222, 28, 57, 0.15) !important",
                backgroundImage: "none",
              },
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          >
            <ListItemIcon className="min-w-[40px]">
              <LogoutIcon className="text-[#DE1C39] text-lg" />
            </ListItemIcon>
            <ListItemText
              primary={avatarDropdown.logout || "Logout"}
              className="text-[#DE1C39] font-medium"
            />
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
};

export default AvatarDropdown;

