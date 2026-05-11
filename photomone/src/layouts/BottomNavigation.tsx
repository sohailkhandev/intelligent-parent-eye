import { Box } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { ROUTES, COLORS } from "@constants";
import {
  HomeIcon,
  HomeFillIcon,
  ShopIcon,
  ShopFillIcon,
  PlusCircleIcon,
  PlusCircleFillIcon,
  ResultIcon,
  ResultFillIcon,
  ProfileIcon,
  ProfileFillIcon,
} from "@assets/icons/svg";
import { useLanguage } from "@providers";

const getNavItems = (sidebar: Record<string, string>) => [
  {
    name: sidebar.home || "Home",
    path: ROUTES.dashboard,
    fullPath: "/dashboard",
    icon: HomeIcon,
    iconFill: HomeFillIcon,
  },
  {
    name: sidebar.shop || "Shop",
    path: ROUTES.shop,
    fullPath: "/dashboard/shop",
    icon: ShopIcon,
    iconFill: ShopFillIcon,
  },
  {
    name: sidebar.mone || "Photo+",
    path: ROUTES.photomone,
    fullPath: "/dashboard/photomone",
    icon: PlusCircleIcon,
    iconFill: PlusCircleFillIcon,
  },
  {
    name: sidebar.result || "Result",
    path: ROUTES.result,
    fullPath: "/dashboard/result",
    icon: ResultIcon,
    iconFill: ResultFillIcon,
  },
  {
    name: sidebar.account || "Account",
    path: ROUTES.profile,
    fullPath: "/dashboard/profile",
    icon: ProfileIcon,
    iconFill: ProfileFillIcon,
  },
];

export const BottomNavigation = () => {
  const location = useLocation();
  const { translations } = useLanguage();
  const sidebar = translations?.sidebar || {};
  const navItems = getNavItems(sidebar);

  const getActiveState = (item: (typeof navItems)[0]) => {
    const isHome = item.path === ROUTES.dashboard;
    if (isHome) {
      return (
        location.pathname === item.fullPath ||
        location.pathname === "/dashboard"
      );
    }
    if (item.path === ROUTES.photomone) {
      return location.pathname.includes("/photomone");
    }
    return (
      location.pathname === item.fullPath ||
      location.pathname.startsWith(item.fullPath + "/")
    );
  };

  return (
    <Box
      component="nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-pb"
      sx={{
        backgroundColor: COLORS.white,
        borderTop: `1px solid ${COLORS.border}`,
        boxShadow: "0 -1px 6px rgba(0,0,0,0.06)",
      }}
    >
      <Box className="flex items-center justify-around px-2 py-3 gap-1">
        {navItems.map((item) => {
          const isHome = item.path === ROUTES.dashboard;
          const active = getActiveState(item);
          const IconComponent =
            active && item.iconFill ? item.iconFill : item.icon;
          const activeColor = COLORS.secondary;
          const inactiveColor = COLORS.black;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={isHome}
              className="flex flex-col items-center justify-center min-w-0 flex-1 transition-colors duration-200 no-underline"
              style={{
                color: active ? activeColor : inactiveColor,
              }}
            >
              <Box
                className="shrink-0 flex items-center justify-center"
                sx={{ width: 28, height: 28 }}
              >
                <IconComponent
                  width={24}
                  height={24}
                  color={active ? activeColor : inactiveColor}
                />
              </Box>
              <span
                className="text-[10px] font-medium truncate w-full text-center"
                style={{ color: active ? activeColor : inactiveColor }}
              >
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </Box>
    </Box>
  );
};

export default BottomNavigation;
