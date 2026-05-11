import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { COLORS, ROUTES } from "@constants";
import { MainButton, MobileDrawer, OutlineButton } from "@components";
import logo from "@assets/images/logo.png";
import { HeaderMenuIcon } from "@assets/icons/svg";
import { useLanguage } from "@providers";

const HEADER_EXPAND_DELAY_MS = 1500;

interface HeaderProps {
  /** When true, header shows at full width immediately (e.g. in auth layout). */
  disableEntryAnimation?: boolean;
}

export const Header = ({ disableEntryAnimation = false }: HeaderProps) => {
  const { translations } = useLanguage();
  const t = translations || {};
  const headerT = t.header || {};

  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerExpanded, setHeaderExpanded] = useState(disableEntryAnimation);

  useEffect(() => {
    if (disableEntryAnimation) return;
    const timeoutId = setTimeout(
      () => setHeaderExpanded(true),
      HEADER_EXPAND_DELAY_MS
    );
    return () => clearTimeout(timeoutId);
  }, [disableEntryAnimation]);

  const navItems: { to: string; label: string; end?: boolean }[] = [
    { to: ROUTES.landing, label: headerT.home || "Home", end: true },
    { to: ROUTES.howItWorks, label: headerT.howItWorks || "How it Works" },
    { to: ROUTES.faq, label: headerT.faq || "FAQ" },
    { to: ROUTES.aboutUs, label: headerT.aboutUs || "About Us" },
    { to: ROUTES.blog, label: headerT.blog || "Blog" },
    {
      to: ROUTES.customerSupport,
      label: headerT.customerSupport || "Customer Support",
    },
  ];

  const menuLinks = navItems
    .filter((item) => item.to !== ROUTES.blog)
    .map(({ to, label }) => ({
      text: label,
      path: to,
    }));

  const loginText = headerT.login || headerT.logIn || "Login";
  const signUpText = headerT.signUp || "Sign up";

  const isActive = (path: string, end?: boolean) => {
    const pathname = location.pathname.replace(/\/$/, "") || "/";
    const normalizedPath = path.replace(/\/$/, "") || "/";
    if (end) return pathname === normalizedPath;
    return (
      pathname === normalizedPath || pathname.startsWith(normalizedPath + "/")
    );
  };

  return (
    <Box
      component="header"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[1200] w-full px-4"
    >
      <Box
        component={motion.div}
        className="flex items-center justify-between lg:px-6 p-4 max-w-[1280px] rounded-full mx-auto overflow-hidden"
        initial={{ scaleX: disableEntryAnimation ? 1 : 0 }}
        animate={{ scaleX: headerExpanded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "50% 50%" }}
        sx={{
          backgroundColor: COLORS.white,
          boxShadow:
            "0px -3px 0px 0px rgba(255,255,255,0.75), 0px 3px 0px 0px rgb(238, 237, 237), 0px 6px 0px 0px rgb(227, 227, 227), 0px 8px 20px -4px rgba(5, 88, 142, 0.12)",
        }}
      >
        <Link to={ROUTES.landing}>
          <img src={logo} alt="PhotoMone" className="w-32 lg:w-[200px]" />
        </Link>

        <Box className="hidden lg:flex items-center gap-8">
          {navItems.map(({ to, label, end }) => {
            const active = isActive(to, end);
            const linkColor = active ? COLORS.secondary : "#26262C";
            return (
              <Link key={to} to={to} style={{ textDecoration: "none" }}>
                <Box
                  component="span"
                  sx={{
                    position: "relative",
                    color: linkColor,
                    transition: "color 0.2s ease",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      bottom: -2,
                      height: "2px",
                      width: 0,
                      backgroundColor: linkColor,
                      transition: "width 0.3s ease",
                    },
                    "&:hover": {
                      opacity: 0.9,
                    },
                    "&:hover::after": {
                      width: "100%",
                    },
                  }}
                >
                  {label}
                </Box>
              </Link>
            );
          })}
        </Box>

        <Box className="hidden lg:flex items-center gap-3">
          <OutlineButton onClick={() => navigate(ROUTES.login)}>
            {loginText}
          </OutlineButton>
          <MainButton onClick={() => navigate(ROUTES.register)}>
            {signUpText}
          </MainButton>
        </Box>

        <Box
          component="button"
          type="button"
          aria-label="Open navigation menu"
          className="lg:hidden flex flex-col justify-between w-6 h-5 ml-auto focus:outline-none"
          onClick={() => setMobileMenuOpen(true)}
        >
          <HeaderMenuIcon />
        </Box>
      </Box>

      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        menuLinks={menuLinks}
        blogLink={{
          text: headerT.blog || "Blog",
          path: ROUTES.blog,
        }}
        showAuthButtons
        loginText={loginText}
        signUpText={signUpText}
        onLoginClick={() => navigate(ROUTES.login)}
        onSignUpClick={() => navigate(ROUTES.register)}
      />
    </Box>
  );
};

export default Header;
