import { Box, Drawer, IconButton, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { COLORS } from "@constants";
import { MainButton, OutlineButton, LanguageDropdown } from "@components";
import { LogoutIcon } from "@assets/icons/svg";

const DRAWER_WIDTH = 300;
const CLOSE_ICON_COLOR = COLORS.grayStrong;
const MENU_TEXT_COLOR = COLORS.generalText;
const DIVIDER_COLOR = COLORS.grayLight;
const LOGOUT_RED = "#DC2626";

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
      stroke={CLOSE_ICON_COLOR}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface MenuLink {
  text: string;
  path: string;
}

/** Optional highlighted row (e.g. Blog) with accent dot — shown after main links, before language. */
export interface BlogDrawerLink {
  text: string;
  path: string;
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  menuLinks: MenuLink[];
  /** Shown after main links with a blinking red dot */
  blogLink?: BlogDrawerLink;
  showAuthButtons?: boolean;
  showLogoutButton?: boolean;
  loginText?: string;
  signUpText?: string;
  logoutText?: string;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  onLogout?: () => void;
}

export const MobileDrawer = ({
  open,
  onClose,
  menuLinks,
  blogLink,
  showAuthButtons = false,
  showLogoutButton = false,
  loginText = "Log in",
  signUpText = "Sign up",
  logoutText = "Logout",
  onLoginClick,
  onSignUpClick,
  onLogout,
}: MobileDrawerProps) => {
  const handleSignUpClick = () => {
    if (onSignUpClick) {
      onSignUpClick();
    }
    onClose();
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    }
    onClose();
  };

  const handleLogoutClick = async () => {
    if (onLogout) {
      await onLogout();
    }
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: COLORS.white,
          width: DRAWER_WIDTH,
          maxWidth: "85vw",
          borderLeft: `1px solid ${DIVIDER_COLOR}`,
          boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.08)",
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          py: 2,
          px: 4,
        }}
      >
        {/* Close Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0.5 }}>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: CLOSE_ICON_COLOR,
              "&:hover": {
                backgroundColor: COLORS.grayLight,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Menu links + optional Blog — same block padding and line-height for even rows */}
        <Box sx={{ display: "flex", flexDirection: "column", py: 1 }}>
          {menuLinks.map((link, index) => (
            <Box key={index}>
              <Link
                to={link.path}
                onClick={onClose}
                style={{
                  textDecoration: "none",
                  color: MENU_TEXT_COLOR,
                  fontWeight: 500,
                  fontSize: "0.9375rem",
                  display: "block",
                  padding: "12px 0",
                  lineHeight: 1.5,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = COLORS.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = MENU_TEXT_COLOR;
                }}
              >
                {link.text}
              </Link>
              <Divider sx={{ borderColor: DIVIDER_COLOR }} />
            </Box>
          ))}
          {blogLink && (
            <Box>
              <Link
                to={blogLink.path}
                onClick={onClose}
                style={{
                  textDecoration: "none",
                  color: MENU_TEXT_COLOR,
                  fontWeight: 500,
                  fontSize: "0.9375rem",
                  display: "block",
                  padding: "12px 0",
                  lineHeight: 1.5,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = COLORS.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = MENU_TEXT_COLOR;
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span className="blog-drawer-dot-blink" aria-hidden />
                  {blogLink.text}
                </span>
              </Link>
              <Divider sx={{ borderColor: DIVIDER_COLOR }} />
            </Box>
          )}
        </Box>

        {/* Fills space so language / auth stay at bottom without a gap above Blog */}
        <Box sx={{ flex: 1, minHeight: 0 }} />

        {/* Language - use existing LanguageDropdown component */}
        <Box sx={{ py: 2 }}>
          <LanguageDropdown />
        </Box>

        {/* Login/Register Buttons - Optional */}
        {showAuthButtons && (
          <Box
            sx={{
              pt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <MainButton onClick={handleLoginClick} className="!w-full">
              {loginText}
            </MainButton>
            <OutlineButton onClick={handleSignUpClick} className="!w-full">
              {signUpText}
            </OutlineButton>
          </Box>
        )}

        {/* Logout - when user is logged in */}
        {showLogoutButton && (
          <Box
            sx={{
              pt: 1,
            }}
          >
            <Box
              onClick={handleLogoutClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleLogoutClick();
                }
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                color: LOGOUT_RED,
                fontWeight: 600,
                fontSize: "0.9375rem",
                py: 2,
                cursor: "pointer",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "rgba(220, 38, 38, 0.06)",
                },
              }}
            >
              <LogoutIcon />
              <span>{logoutText}</span>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default MobileDrawer;
