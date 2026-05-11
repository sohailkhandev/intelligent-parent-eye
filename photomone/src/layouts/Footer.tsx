import { Box, Typography } from "@mui/material";
import { COLORS, ROUTES } from "@constants";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
} from "@assets/icons/svg";
import featuresBg from "@assets/images/featuresBg.png";
import photomoneHighlighted from "@assets/images/PhotoMoneHighlighted.png";
import { ThemeText, LanguageDropdown } from "@components";
import logo from "@assets/images/logo.png";
import { Link } from "react-router-dom";
import { useLanguage } from "@providers";

interface FooterProps {
  className?: string;
  isInDashboard?: boolean;
}

export const Footer = ({ className = "" }: FooterProps) => {
  const { translations } = useLanguage();
  const f = translations?.footer ?? {};
  const nav = f.nav ?? {};
  const legal = f.legal ?? {};
  const social = f.social ?? {};
  const images = f.images ?? {};

  const siteMapLinks = [
    { label: nav.home ?? "Home", to: ROUTES.landing },
    { label: nav.howItWorks ?? "How It Works", to: ROUTES.howItWorks },
    { label: nav.faq ?? "FAQs", to: ROUTES.faq },
    { label: nav.aboutUs ?? "About Us", to: ROUTES.aboutUs },
    { label: nav.blog ?? "Blog", to: ROUTES.blog },
    { label: nav.support ?? "Support", to: ROUTES.customerSupport },
  ];

  const legalLinks = [
    {
      label: legal.privacyPolicy ?? "Privacy Policy",
      to: ROUTES.privacyPolicy,
    },
    {
      label: legal.termsAndConditions ?? "Terms And Conditions",
      to: ROUTES.termsAndConditions,
    },
  ];

  return (
    <Box
      component="footer"
      className={`w-full max-w-full pt-12 lg:pt-16 pb-4 overflow-hidden relative ${className}`}
      sx={{
        backgroundImage: `url(${featuresBg})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Large PHOTOMONE watermark (background) - replace with image from assets if you have one */}

      <Box className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-8 pt-4 lg:pt-10">
        {/* Upper section: Brand + slogan/subtext | Site Map | Legal | Language */}
        <Box className="flex flex-col lg:flex-row gap-10 lg:gap-8 mb-12 md:mb-16">
          {/* Brand + slogan + subtext (equal-height blocks, ~3 lines each) */}
          <Box className="flex-1 min-w-0">
            <Link to={ROUTES.landing} className="mb-4 inline-block">
              <img
                src={logo}
                alt={f.brandAlt || "PhotoMone"}
                className="w-32 lg:w-[200px]"
              />
            </Link>
            <Box className="flex flex-col gap-0 max-w-[min(100%,26rem)]">
              <Typography
                component="div"
                className="font-semibold italic leading-snug text-base lg:text-lg flex items-center mb-6"
                sx={{
                  color: COLORS.secondary,
                }}
              >
                &ldquo;
                {f.tagline || "Turn Your Virtual Images into Real Rewards."}
                &rdquo;
              </Typography>
              <ThemeText
                text={
                  f.description ||
                  "Create virtual images from your photos, enhance them through fusion, trade them in the marketplace, earn points, and redeem them for gift cards or real-world rewards."
                }
              />
            </Box>
          </Box>

          <Box className="flex-1 flex gap-8 flex-wrap justify-between items-start mt-2 lg:mt-0">
            {/* Site Map */}
            <Box className="flex-1 min-w-[140px]">
              <Typography className="font-bold mb-4">
                {f.siteMapTitle || "Site Map"}
              </Typography>
              <Box className="flex flex-col gap-4">
                {siteMapLinks.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    style={{ textDecoration: "none" }}
                    className="cursor-pointer font-light"
                  >
                    <Box
                      component="span"
                      sx={{
                        color: COLORS.generalText,
                        position: "relative",
                        transition: "color 0.2s ease",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          bottom: -2,
                          height: "1px",
                          width: 0,
                          backgroundColor: COLORS.secondary,
                          transition: "width 0.25s ease",
                        },
                        "&:hover": {
                          color: COLORS.secondary,
                        },
                        "&:hover::after": {
                          width: "100%",
                        },
                      }}
                    >
                      {label}
                    </Box>
                  </Link>
                ))}
              </Box>
            </Box>
            <Box className="flex-1 min-w-[140px]">
              <Typography className="font-bold mb-4">
                {f.legalTitle || "Legal"}
              </Typography>
              <Box className="flex flex-col gap-4">
                {legalLinks.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    style={{ textDecoration: "none" }}
                    className="cursor-pointer font-light"
                  >
                    <Box
                      component="span"
                      sx={{
                        color: COLORS.generalText,
                        position: "relative",
                        transition: "color 0.2s ease",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          bottom: -2,
                          height: "1px",
                          width: 0,
                          backgroundColor: COLORS.secondary,
                          transition: "width 0.25s ease",
                        },
                        "&:hover": {
                          color: COLORS.secondary,
                        },
                        "&:hover::after": {
                          width: "100%",
                        },
                      }}
                    >
                      {label}
                    </Box>
                  </Link>
                ))}
              </Box>
            </Box>

            {/* Language dropdown - same styling as drawer, label hidden in footer */}
            <Box className="min-w-[180px]">
              <Typography className="font-bold mb-4">
                {f.languageSectionTitle || "Language"}
              </Typography>
              <LanguageDropdown hideLabel className="w-full" />
            </Box>
          </Box>
        </Box>

        {/* Lower section: Copyright | Social icons (Facebook, Instagram, TikTok, YouTube) */}
        <Box className="flex flex-col sm:flex-row items-start lg:items-center justify-between gap-4 pt-6 border-t border-[#E0E0E0]">
          <ThemeText
            text={f.copyright || "© 2026 PhotoMone. All rights reserved."}
            className="order-last sm:order-none text-left font-light"
          />
          <Box className="flex items-center gap-4 order-first sm:order-none">
            {[
              {
                Icon: FacebookIcon,
                href: "https://web.facebook.com/profile.php?id=61583848603851",
                label: social.facebook ?? "Facebook",
              },
              {
                Icon: InstagramIcon,
                href: "https://www.instagram.com",
                label: social.instagram ?? "Instagram",
              },
              {
                Icon: TiktokIcon,
                href: "https://www.tiktok.com/@photomone",
                label: social.tiktok ?? "TikTok",
              },
              {
                Icon: YoutubeIcon,
                href: "https://www.youtube.com/channel/UCLwz09e5aNCZyNAyHvELovQ",
                label: social.youtube ?? "YouTube",
              },
            ].map(({ Icon, href, label }) => (
              <Box
                key={label}
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:opacity-90 transition-opacity"
                sx={{
                  borderRadius: "50%",
                  backgroundColor: "#F9929B !important",
                  "& svg": { width: 20, height: 20 },
                  "@media (min-width: 640px)": {
                    "& svg": { width: 25, height: 25 },
                  },
                }}
              >
                <Icon />
              </Box>
            ))}
          </Box>
        </Box>
        <img
          src={photomoneHighlighted}
          alt={images.highlight || "PhotoMone"}
          className="w-full mt-8"
        />
      </Box>
    </Box>
  );
};

export default Footer;
