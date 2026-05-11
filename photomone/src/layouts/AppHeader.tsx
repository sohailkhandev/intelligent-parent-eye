import { Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MenuIcon,
  NotificationBellIcon,
  PointsIcon,
  EarningsIcon,
} from "@assets/icons/svg";
import { NotificationDialog, MobileDrawer, ThemeText } from "@components";
import { COLORS, ROUTES } from "@constants";
import { useAuthContext, useLanguage } from "@providers";
import { NotificationApis } from "@apis";

export const AppHeader = () => {
  const navigate = useNavigate();
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { authUser, logout } = useAuthContext();
  const { translations } = useLanguage();

  const t = translations || {};
  const appHeader = t.appHeader || {};

  const menuLinks = [
    { text: t.header?.howItWorks || "How it Works", path: ROUTES.howItWorks },
    { text: t.header?.faq || "FAQ", path: ROUTES.faq },
    { text: t.header?.aboutUs || "About Us", path: ROUTES.aboutUs },
    {
      text: t.header?.privacyPolicy || "Privacy Policy",
      path: ROUTES.privacyPolicy,
    },
    {
      text: t.header?.termsAndConditions || "Terms & Conditions",
      path: ROUTES.termsAndConditions,
    },
    {
      text: t.header?.customerSupport || "Customer Support",
      path: ROUTES.customerSupport,
    },
  ];

  // Fetch notifications from API
  const { data: notificationsData } = NotificationApis.useGetNotifications();
  const notifications = Array.isArray(notificationsData?.data?.notifications)
    ? notificationsData.data.notifications
    : [];
  const unreadCount = notificationsData?.data?.unreadCount ?? 0;

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatEarningsDollars = (earnings: number | undefined): string => {
    const dollars = earnings ?? 0;
    return `$${dollars.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatPoints = (points: number | undefined): string => {
    const value = points ?? 0;

    // Less than 10,000: show as is
    if (value < 10000) {
      return value.toLocaleString();
    }

    // Between 10,000 and 999,999: show as X.Xk
    if (value < 1000000) {
      const thousands = value / 1000;
      // Round to 1 decimal place, but remove trailing zero if it's a whole number
      const rounded = Math.round(thousands * 10) / 10;
      return rounded % 1 === 0 ? `${rounded}k` : `${rounded.toFixed(1)}k`;
    }

    // 1 million and above: show as X.XM
    const millions = value / 1000000;
    const rounded = Math.round(millions * 10) / 10;
    return rounded % 1 === 0 ? `${rounded}M` : `${rounded.toFixed(1)}M`;
  };

  const headerBg = COLORS.white;
  const pillBg = "#F6F6F6";
  const textMuted = "#555555";
  const borderBottom = "#E0E0E0";

  const avatarWithGreeting = (
    <Box className="flex items-center gap-2 lg:gap-3">
      <Box className="relative shrink-0">
        <Box
          onClick={() => navigate(ROUTES.dashboard + "/" + ROUTES.profile)}
          className="h-10 w-10 lg:h-12 lg:w-12 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          sx={{ backgroundColor: COLORS.grayLight }}
        >
          {authUser?.profilePicture ? (
            <Box
              component="img"
              src={authUser.profilePicture}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <Box
              className="h-full w-full flex items-center justify-center text-white font-semibold text-sm"
              sx={{ backgroundColor: COLORS.primary }}
            >
              {getUserInitials(authUser?.fullName)}
            </Box>
          )}
        </Box>
        <Box
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
          sx={{ backgroundColor: "#84CC16" }}
        />
      </Box>
      <Box className="hidden md:flex gap-1 max-w-[150px] lg:max-w-full truncate">
        <ThemeText text={appHeader.hi || "Hi,"} className="font-semibold" />
        <ThemeText
          text={authUser?.fullName || "User"}
          className="font-semibold truncate"
        />
      </Box>
    </Box>
  );

  // Icon wrapper: smaller below lg, current size at lg+
  const iconSizeSx = {
    display: "inline-flex",
    "& svg": { width: "100%", height: "100%" },
  };
  const pointsIconWrapperSx = {
    ...iconSizeSx,
    width: 20,
    height: 20,
    "@media (min-width: 1024px)": { width: 32, height: 32 },
  };

  const earningsPill = (
    <Box
      onClick={() => navigate(ROUTES.dashboard + "/" + ROUTES.shop)}
      className="flex items-center gap-2 rounded-full px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity"
      sx={{ backgroundColor: pillBg }}
    >
      <Box sx={pointsIconWrapperSx}>
        <EarningsIcon width={32} height={32} />
      </Box>
      <span className="text-sm font-medium" style={{ color: textMuted }}>
        {appHeader.earnings ?? "Earnings:"}&nbsp;
      </span>
      <span
        className="text-sm font-medium me-1"
        style={{ color: COLORS.primary }}
      >
        {formatEarningsDollars(authUser?.earnings)}
      </span>
    </Box>
  );

  const pointsPill = (
    <Box
      onClick={() => navigate(ROUTES.dashboard + "/" + ROUTES.shop)}
      className="flex items-center gap-2 rounded-full px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity"
      sx={{ backgroundColor: pillBg }}
    >
      <Box sx={pointsIconWrapperSx}>
        <PointsIcon width={32} height={32} />
      </Box>
      <span className="text-sm font-medium" style={{ color: textMuted }}>
        {appHeader.points || "Points:"}&nbsp;
      </span>
      <span
        className="text-sm font-medium me-1"
        style={{ color: COLORS.primary }}
      >
        {formatPoints(authUser?.points)}
      </span>
    </Box>
  );

  const notificationButton = (
    <Box
      className="w-8 h-8 lg:w-10 lg:h-10 rounded-md flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity p-1.5 lg:p-1"
      sx={{
        backgroundColor: pillBg,
        color: textMuted,
        "& svg": { width: "100%", height: "100%", maxWidth: 20, maxHeight: 20 },
        "@media (min-width: 1024px)": {
          "& svg": { maxWidth: 24, maxHeight: 24 },
        },
      }}
      onClick={() => setNotificationDialogOpen(true)}
    >
      <NotificationBellIcon hasUnread={unreadCount > 0} />
    </Box>
  );

  const menuButton = (
    <Box
      className="w-8 h-8 lg:w-10 lg:h-10 rounded-md flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity p-1.5 lg:p-1"
      sx={{
        backgroundColor: pillBg,
        color: textMuted,
        "& svg": { width: "100%", height: "100%", maxWidth: 20, maxHeight: 20 },
        "@media (min-width: 1024px)": {
          "& svg": { maxWidth: 24, maxHeight: 24 },
        },
      }}
      onClick={() => setMobileMenuOpen(true)}
    >
      <MenuIcon />
    </Box>
  );

  return (
    <>
      {/* Mobile/Tablet Header - Light theme */}
      <Box
        component="header"
        className="md:hidden flex-shrink-0 flex items-center justify-between px-4 py-3 border-b"
        sx={{ backgroundColor: headerBg, borderColor: borderBottom }}
      >
        <Box className="flex items-center gap-2 min-w-0 flex-1">
          {avatarWithGreeting}
        </Box>
        <Box className="flex items-center gap-1.5 shrink-0">
          <Box
            onClick={() => navigate(ROUTES.dashboard + "/" + ROUTES.shop)}
            className="flex items-center gap-1 rounded-lg px-1.5 py-1.5 cursor-pointer"
            sx={{ backgroundColor: pillBg }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                display: "inline-flex",
                "& svg": { width: "100%", height: "100%" },
              }}
            >
              <EarningsIcon width={32} height={32} />
            </Box>
            <span
              className="text-xs font-medium leading-none"
              style={{ color: COLORS.primary }}
            >
              {formatEarningsDollars(authUser?.earnings)}
            </span>
          </Box>
          <Box
            onClick={() => navigate(ROUTES.dashboard + "/" + ROUTES.shop)}
            className="flex items-center gap-1 rounded-lg px-1.5 py-1.5 cursor-pointer"
            sx={{ backgroundColor: pillBg }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                display: "inline-flex",
                "& svg": { width: "100%", height: "100%" },
              }}
            >
              <PointsIcon width={32} height={32} />
            </Box>
            <span
              className="text-xs font-medium leading-none"
              style={{ color: COLORS.primary }}
            >
              {formatPoints(authUser?.points)}
            </span>
          </Box>
          {notificationButton}
          {menuButton}
        </Box>
      </Box>

      {/* Desktop Header - Light theme */}
      <Box
        component="header"
        className="hidden md:flex flex-shrink-0 items-center justify-between gap-4 px-8 py-4 border-b"
        sx={{ backgroundColor: headerBg, borderColor: borderBottom }}
      >
        {avatarWithGreeting}
        <Box className="flex items-center gap-2">
          {earningsPill}
          {pointsPill}
          {notificationButton}
          {menuButton}
        </Box>
      </Box>

      {/* Drawer Menu */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        menuLinks={menuLinks}
        blogLink={{
          text: appHeader.blog || "Blog",
          path: ROUTES.blog,
        }}
        showAuthButtons={false}
        showLogoutButton={!!authUser}
        logoutText={appHeader.avatarDropdown?.logout || "Logout"}
        onLogout={async () => {
          try {
            await logout();
            navigate(ROUTES.login);
          } catch (error) {
            console.error("Logout failed:", error);
          }
        }}
      />

      {/* Notification Dialog */}
      <NotificationDialog
        open={notificationDialogOpen}
        onClose={() => setNotificationDialogOpen(false)}
        notifications={notifications}
      />
    </>
  );
};

export default AppHeader;
