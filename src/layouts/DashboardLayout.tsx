import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@providers";
import { COLORS, ROUTES } from "@constants";
import logo from "@assets/images/logo.png";

const SIDEBAR_WIDTH = 260;

export const DashboardLayout = () => {
  const { authUser, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const isHome = path === "/" || path === ROUTES.home;
  const isChildOverview =
    path === ROUTES.childOverview ||
    path.startsWith(`${ROUTES.childOverview}/`);
  const isAlerts = path === ROUTES.alerts;
  const isSettings = path === ROUTES.settings;

  const navItem = (route: string, active: boolean, label: string) => ({
    route,
    active,
    label,
  });
  const navItems = [
    navItem(ROUTES.home, isHome, "Home"),
    navItem(ROUTES.childOverview, isChildOverview, "Child Overview"),
    navItem(ROUTES.alerts, isAlerts, "Alerts"),
    navItem(ROUTES.settings, isSettings, "Settings"),
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: `${COLORS.primary}06` }}
    >
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 bottom-0 flex flex-col z-20"
        style={{
          width: SIDEBAR_WIDTH,
          backgroundColor: COLORS.white,
          borderRight: `1px solid ${COLORS.border}`,
          boxShadow: `4px 0 24px ${COLORS.border}`,
        }}
      >
        {/* Brand + Logo */}
        <div
          className="px-5 py-5 border-b flex items-center justify-center gap-3"
          style={{ borderColor: COLORS.border }}
        >
          <img
            src={logo}
            alt="Parent Eye"
            className="h-[70px] object-contain flex-shrink-0"
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ route, active, label }) => (
            <button
              key={route}
              type="button"
              onClick={() => navigate(route)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? `${COLORS.primary}18` : "transparent",
                color: active ? COLORS.primary : COLORS.generalText,
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div
          className="p-4 border-t"
          style={{ borderColor: COLORS.border }}
        >
          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-sm font-medium rounded-xl transition-opacity hover:opacity-90"
            style={{
              color: COLORS.white,
              backgroundColor: COLORS.secondary,
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className="flex-1 min-h-screen flex flex-col"
        style={{ marginLeft: SIDEBAR_WIDTH }}
      >
        {/* Header */}
        <header
          className="sticky top-0 z-10 flex items-center w-full px-6 lg:px-8 py-3"
          style={{
            backgroundColor: COLORS.white,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: COLORS.generalText }}
          >
            {authUser?.fullName ?? ""}
          </h2>
        </header>

        <div className="flex-1 p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
