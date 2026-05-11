import { Box } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { COLORS, ROUTES } from "@constants";
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
  GlobeIcon,
  LogoutIcon,
} from "@assets/icons/svg";
import { LanguageDropdown } from "@components";
import { useLanguage, useAuthContext } from "@providers";
import logo from "@assets/images/logo.png";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const location = useLocation();
  const { translations } = useLanguage();
  const { logout } = useAuthContext();

  const t = translations || {};
  const sidebar = t.sidebar || {};

  const navItems = [
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
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <Box
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Light theme */}
      <Box
        className={`fixed top-0 left-0 h-full w-[300px] z-50 transition-transform duration-300 lg:translate-x-0 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:flex border-r border-[#E0E0E0] p-6`}
        sx={{ backgroundColor: "#FFFFFF", borderColor: COLORS.border }}
      >
        <Box
          className="pb-8 mt-4 mb-6 border-b"
          sx={{ borderColor: COLORS.border }}
        >
          <img src={logo} alt="PhotoMone" className="w-32 lg:w-[200px]" />
        </Box>

        {/* Navigation */}
        <Box component="nav" className="flex-1 px-0 py-2 space-y-2">
          {navItems.map((item) => {
            const active = getActiveState(item);
            const IconComponent =
              active && item.iconFill ? item.iconFill : item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === ROUTES.dashboard}
                onClick={onClose}
                className={`group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-[#37D5D6] text-white font-semibold"
                    : "bg-[#F9F9F9] text-[#555555] hover:bg-[#EEEEEE]"
                }`}
              >
                <Box className="h-6 w-6 flex items-center justify-center shrink-0">
                  <IconComponent width={22} height={22} color="currentColor" />
                </Box>
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </Box>

        {/* Separator */}
        <Box className="my-3" />

        {/* Language */}
        <Box className="px-2">
          <LanguageDropdown
            label={
              <>
                <GlobeIcon className="shrink-0" style={{ color: "#555555" }} />
                <span>{sidebar.language ?? "Language:"}</span>
              </>
            }
          />
        </Box>

        {/* Logout */}
        <Box className="mt-auto pt-4">
          <Box
            component="button"
            type="button"
            onClick={() => logout()}
            className="flex items-center justify-center gap-3 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90 border-0 cursor-pointer bg-transparent text-left"
            sx={{ color: "#F44336" }}
          >
            <LogoutIcon />
            <span>{sidebar.logoutAccount ?? "Logout"}</span>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
