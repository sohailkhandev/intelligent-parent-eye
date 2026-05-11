import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { COLORS, ROUTES } from "@constants";
import { useLanguage } from "@providers";

/* Premium gaming-style viewport animations — trigger when section is in view, slower pace */
const viewportOnce = {
  once: true,
  amount: 0.25,
  margin: "0px 0px -80px 0px",
};
/**
 * How it works: balance early trigger (amount ~0) vs too-late (high amount + tight margin).
 */
const viewportHowItWorks = {
  once: true,
  amount: 0.22,
  margin: "-4% 0px -6% 0px",
};
const howItWorksStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.16, delayChildren: 0.07 },
  },
};
const howItWorksEnter = {
  type: "spring" as const,
  stiffness: 140,
  damping: 28,
  mass: 0.85,
};
const fadeInUpHowItWorks = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: howItWorksEnter },
};
const springSnappy = { type: "spring" as const, stiffness: 200, damping: 26 };
const springBounce = { type: "spring" as const, stiffness: 180, damping: 22 };
const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: springSnappy },
};
const fadeInScale = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: springBounce },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.14 } },
};
const slideInLeft = {
  hidden: { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0, transition: springSnappy },
};
const slideInRight = {
  hidden: { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0, transition: springSnappy },
};
import {
  MainButton,
  HeroHeading,
  ThemeText,
  MainHeading,
  LabelBadge,
} from "@components";
import heroBg from "@assets/images/heroBg.png";
import { HeroSectionCard } from "../components";
import heroCardImg1 from "@assets/images/heroCardImg1.png";
import heroCardImg2 from "@assets/images/heroCardImg2.png";
import heroCardImg3 from "@assets/images/heroCardImg3.png";
import leftSideImage from "@assets/images/leftSideImage.png";
import blueEllipse from "@assets/images/blueEllipse.png";
import rightSideImage from "@assets/images/rightSideImage.png";
import pinkEllipse from "@assets/images/pinkEllipse.png";
import LeftFusionImage from "@assets/images/LeftFusionImage.png";
import gradientEllipse from "@assets/images/gradientEllipse.png";
import photoMoneShape from "@assets/images/photoMoneShape.png";
import {
  CheckIcon,
  GetRewardIcon,
  StartIcon,
  FusionEnhanceIcon,
  GenerateIcon,
  TradeIcon,
  IncreaseValueIcon,
} from "@assets/icons/svg";
import featuresBg from "@assets/images/featuresBg.png";

const DEFAULT_FEATURES_LEFT = [
  "Upload your face photo and let AI generate a completely new, one-of-a-kind virtual image.",
  "Buy and sell images in real-time, earning exposure and tracking your sales instantly.",
  "Earn points and rewards by selling images and leveraging AI-enhanced virtual assets.",
];

const DEFAULT_FEATURES_RIGHT = [
  "Fuse two photos to refine facial features and create sharper, trade-ready images.",
  "Increase your image's score through trading and fusion to boost their marketplace value.",
  "Apply sponsor products or backgrounds to images for fresh earning opportunities.",
];

const DEFAULT_SECTION_CREATE_BULLETS = [
  "Prepare your face photo and upload it to an empty gallery slot.",
  "AI verifies the photo contains a real human face.",
  "Based on your facial structure, it generates a completely new virtual image.",
  "The created image is automatically added to your gallery, ready for trading or enhancement.",
];

const DEFAULT_SECTION_TRADE_BULLETS = [
  "Click Purchase to buy images you like from the marketplace.",
  "Purchasing an image immediately gives you exposure opportunities for your own photos.",
  "Click Sell, select a gallery image, set exposure value, and start selling in real-time.",
  "After a successful sale, a congratulatory screen and final sales summary appear.",
  "All trading follows fair system rules for transparency and reliability.",
];

const DEFAULT_SECTION_FUSION_BULLETS = [
  "Fuse two photos to create upgraded images using facial attribute values.",
  "Fusion requires a minimum score earned from previous trades.",
  "Each photo can be fused up to six times to gradually enhance appeal.",
  "A fused image's value is ultimately determined by other users and confirmed via license sales.",
  "Newly fused images can then be traded, creating additional earning opportunities.",
];

const DEFAULT_HOW_TITLES = [
  "Start with Your Photo",
  "Generate a Virtual Image",
  "Enhance Through Fusion",
  "List and Trade",
  "Increase Image Value",
  "Redeem Rewards",
];

const DEFAULT_HOW_DESCRIPTIONS = [
  "Choose a photo of your face and upload it to an empty gallery slot. The AI will verify it's a real human face.",
  "Based on your facial structure, the AI creates a completely new virtual face that doesn't exist anywhere else.",
  "Select two photos and fuse them to improve facial features. Fusion can be repeated multiple times to gradually enhance your images.",
  "Put your images up for sale or purchase others. Each trade gives points and exposure opportunities to help grow your image's value.",
  "Score your images through trading, fusion, and other activities. Higher scores mean higher value and better earning potential.",
  "Collect points from your activities and exchange them for gift cards or other real-world rewards.",
];

type HowItWorksStep = {
  title: string;
  description: string;
  side: "left" | "right";
  Icon: React.ComponentType<{ color?: string }>;
  iconBg: "accent" | "white";
};

const HOW_IT_WORKS_ICON_META: Omit<HowItWorksStep, "title" | "description">[] = [
  { side: "left", Icon: StartIcon, iconBg: "accent" },
  { side: "right", Icon: GenerateIcon, iconBg: "white" },
  { side: "left", Icon: FusionEnhanceIcon, iconBg: "white" },
  { side: "right", Icon: TradeIcon, iconBg: "white" },
  { side: "left", Icon: IncreaseValueIcon, iconBg: "white" },
  { side: "right", Icon: GetRewardIcon, iconBg: "white" },
];

const stepCardTransition = "background-color 0.4s ease, box-shadow 0.4s ease";
const stepIconTransition = "color 0.4s ease, fill 0.4s ease";
const stepDotTransition = "background-color 0.4s ease, box-shadow 0.4s ease";

export const LandingScreen = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { translations } = useLanguage();
  const t = translations ?? {};

  const hero = (t.hero && typeof t.hero === "object" ? t.hero : {}) as Record<string, string>;
  const images = (t.images && typeof t.images === "object" ? t.images : {}) as Record<string, string>;

  const sectionCreate = t.sectionCreate as { heading?: string; bullets?: string[] } | undefined;
  const createBullets =
    sectionCreate?.bullets?.length ? sectionCreate.bullets : DEFAULT_SECTION_CREATE_BULLETS;
  const createHeading = sectionCreate?.heading ?? "CREATE IMAGES";

  const sectionTrade = t.sectionTrade as { heading?: string; bullets?: string[] } | undefined;
  const tradeBullets =
    sectionTrade?.bullets?.length ? sectionTrade.bullets : DEFAULT_SECTION_TRADE_BULLETS;
  const tradeHeading = sectionTrade?.heading ?? "TRADE WITH CONFIDENCE";

  const sectionFusion = t.sectionFusion as { heading?: string; bullets?: string[] } | undefined;
  const fusionBullets =
    sectionFusion?.bullets?.length ? sectionFusion.bullets : DEFAULT_SECTION_FUSION_BULLETS;
  const fusionHeading = sectionFusion?.heading ?? "ENHANCE WITH FUSION";

  const landingFeatures = t.landingFeatures as {
    badge?: string;
    title?: string;
    left?: string[];
    right?: string[];
  } | undefined;
  const featuresLeft =
    landingFeatures?.left?.length ? landingFeatures.left : DEFAULT_FEATURES_LEFT;
  const featuresRight =
    landingFeatures?.right?.length ? landingFeatures.right : DEFAULT_FEATURES_RIGHT;
  const featuresBadge = landingFeatures?.badge ?? "Features";
  const featuresTitle = landingFeatures?.title ?? "All Features in One";

  const landingHowItWorks = t.landingHowItWorks as {
    badge?: string;
    title?: string;
    steps?: { title?: string; description?: string }[];
  } | undefined;

  const howItWorksSteps = useMemo<HowItWorksStep[]>(() => {
    const steps = landingHowItWorks?.steps;
    return HOW_IT_WORKS_ICON_META.map((meta, i) => ({
      ...meta,
      title: steps?.[i]?.title || DEFAULT_HOW_TITLES[i] || "",
      description: steps?.[i]?.description || DEFAULT_HOW_DESCRIPTIONS[i] || "",
    }));
  }, [landingHowItWorks?.steps]);

  useEffect(() => {
    const refs = stepRefs.current.filter(Boolean);
    if (refs.length === 0) return;
    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target, entry.intersectionRatio);
        });
        let bestIndex = 0;
        let bestRatio = 0;
        refs.forEach((el, i) => {
          if (!el) return;
          const r = ratios.get(el) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestIndex = i;
          }
        });
        setActiveStepIndex(bestIndex);
      },
      {
        threshold: [0, 0.1, 0.2, 0.4, 0.6, 0.8, 1],
        rootMargin: "-15% 0px -35% 0px",
      }
    );
    refs.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [isDesktop]);

  return (
    <>
      <Box
        component="section"
        className="relative flex items-center justify-center overflow-hidden lg:pt-30 pt-26 pb-15 px-4"
        sx={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderBottomLeftRadius: "50% 80px",
          borderBottomRightRadius: "50% 80px",
        }}
      >
        {/* Animated gradient mix – colors move smoothly throughout hero */}
        <Box
          className="absolute inset-0 z-0 pointer-events-none"
          aria-hidden
          sx={{
            background:
              "linear-gradient(135deg, #fff 0%, #fce4ec 12%, #fff 22%, #e3f2fd 32%, #fff 42%, #f3e5f5 52%, #fff 62%, #fff3e0 72%, #fff 80%, #e8f5e9 88%, #fff 100%)",
            backgroundSize: "400% 400%",
            animation: "hero-gradient-flow 16s ease infinite",
          }}
        />
        <Box
          component={motion.div}
          className="relative z-10 flex flex-col items-center max-w-[900px] mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          <Box component={motion.div} variants={fadeInUp}>
            <LabelBadge label={hero.badge || "AI-Generated Image Marketplace"} />
          </Box>

          {/* Main heading */}
          <Box component={motion.div} variants={fadeInUp}>
            <HeroHeading
              title={<>{hero.titleBefore || "Profit From Your Photo"}</>}
              lastWord={hero.titleHighlight || "Fusions"}
            />
          </Box>

          <Box
            component={motion.div}
            variants={fadeInUp}
            className="max-w-[800px] mt-4 lg:mt-2 mb-8"
          >
            <ThemeText
              text={
                hero.subtitle ||
                "Transform your photos through AI-powered fusion and start earning from your creations. Create, fuse, and monetize your images—all in one platform."
              }
            />
          </Box>

          <Box
            component={motion.div}
            variants={fadeInScale}
            className="flex flex-row items-center justify-between gap-6 lg:gap-14 mb-2 lg:mb-4"
          >
            <Box className="transform -rotate-4 flex-1">
              <HeroSectionCard
                img={heroCardImg1}
                alt={images.heroCard || "hero section card"}
              />
            </Box>

            <Box className="flex-1">
              <HeroSectionCard
                img={heroCardImg2}
                alt={images.heroCard || "hero section card"}
              />
            </Box>

            <Box className="transform rotate-4 flex-1">
              <HeroSectionCard
                img={heroCardImg3}
                alt={images.heroCard || "hero section card"}
              />
            </Box>
          </Box>

          {/* FACE / RANK / FUSION text section with dotted connectors */}
          <Box
            component={motion.div}
            variants={fadeInUp}
            className="w-full rounded-xl mb-8"
          >
            <Box className="flex items-start  justify-between lg:gap-14 gap-2 mx-auto">
              {/* FACE */}
              <Box className="flex-1 flex flex-row items-center">
                <Box className="flex-1">
                  <Typography
                    className="text-base lg:text-xl font-bold uppercase tracking-wide"
                    sx={{
                      color: COLORS.generalText,
                    }}
                  >
                    {hero.createTitle || "CREATE"}
                  </Typography>
                  <Typography
                    className="mt-1 text-[10px] lg:text-base "
                    sx={{
                      color: COLORS.grayStrong,
                      lineHeight: 1.5,
                    }}
                  >
                    {hero.createBody ||
                      "Upload your photo and let AI generate a unique virtual image."}
                  </Typography>
                </Box>
              </Box>

              {/* RANK */}
              <Box className="flex-1 flex md:flex-row items-center justify-center !text-center">
                <Box className="flex-1">
                  <Typography
                    className="text-base lg:text-xl font-bold uppercase tracking-wide"
                    sx={{
                      color: COLORS.primary,
                      letterSpacing: "0.05em",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        display: { xs: "none", lg: "block" },
                        position: "absolute",
                        right: "-46%",
                        top: "20%",
                        width: "75%",
                        height: "10px",
                        borderBottom: `1px dashed ${COLORS.darkBorder}`,
                      },
                      "&::before": {
                        content: '""',
                        display: { xs: "none", lg: "block" },
                        position: "absolute",
                        left: "-50%",
                        top: "20%",
                        width: "75%",
                        height: "10px",
                        borderBottom: `1px dashed ${COLORS.darkBorder}`,
                      },
                    }}
                  >
                    {hero.tradeTitle || "TRADE"}
                  </Typography>
                  <Typography
                    className="mt-1 text-[10px] lg:text-base "
                    sx={{
                      color: COLORS.grayStrong,
                      lineHeight: 1.5,
                    }}
                  >
                    {hero.tradeBody ||
                      "Buy and sell images in real-time and earn exposure instantly."}
                  </Typography>
                </Box>
              </Box>

              {/* FUSION */}
              <Box className="flex-1 flex flex-col md:flex-row items-center min-w-0">
                <Box className="flex-1">
                  <Typography
                    className="text-base lg:text-xl font-bold uppercase tracking-wide"
                    sx={{
                      fontSize: "1.25rem",
                      color: COLORS.secondary,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {hero.enhanceTitle || "ENHANCE"}
                  </Typography>
                  <Typography
                    className="mt-1 text-[10px] lg:text-base"
                    sx={{
                      color: COLORS.grayStrong,
                      lineHeight: 1.5,
                    }}
                  >
                    {hero.enhanceBody ||
                      "Fuse two photos to enhance features and create trade-ready images."}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* CTA Button */}
          <Box component={motion.div} variants={fadeInUp}>
            <MainButton onClick={() => navigate(ROUTES.register)}>
              {hero.cta || "Join now and get 100 bonus points."}
            </MainButton>
          </Box>
        </Box>
      </Box>

      {/* FACE section - phones + ellipse left, bullet list right */}
      <Box
        component="section"
        className="w-full pt-10 md:pt-16 px-4 md:px-8 relative"
      >
        <Box className=" max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <img
            src={blueEllipse}
            alt={images.blueEllipse || "blue ellipse"}
            className="absolute z-0 left-0 top-1/2 -translate-y-[40%] h-full"
          />

          {/* Left: blue ellipse behind phones */}
          <Box
            component={motion.div}
            className="relative w-full md:w-[40%] flex items-center justify-e md:min-h-[350px]"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={slideInLeft}
          >
            <Box
              component="img"
              src={leftSideImage}
              alt={images.leftPhone || "PhotoMone app on mobile"}
              className="relative z-10 w-full object-contain"
            />
          </Box>

          {/* Right: FACE heading + bullet list */}
          <Box
            component={motion.div}
            className="w-full md:w-[50%] flex flex-col text-left"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={slideInRight}
          >
            <MainHeading title={createHeading} />
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {createBullets.map((text, index) => (
                <Box
                  key={index}
                  component="li"
                  className="flex items-start gap-3"
                >
                  <Box
                    className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-1.5"
                    sx={{
                      backgroundColor: COLORS.secondary,
                      color: COLORS.white,
                    }}
                  >
                    <CheckIcon />
                  </Box>
                  <ThemeText text={text} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* RANK section - bullet list left, phones + pink ellipse right */}
      <Box
        component="section"
        className="w-full pt-10 md:pt-16 px-4 md:px-8 relative"
      >
        <Box className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <img
            src={pinkEllipse}
            alt=""
            aria-hidden
            className="absolute z-0 right-0 top-1/2 -translate-y-[30%] h-full object-contain"
          />

          {/* Left: RANK heading + bullet list (teal checkmarks) */}
          <Box
            component={motion.div}
            className="relative z-10 w-full md:w-[45%] flex flex-col text-left order-2 md:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={slideInLeft}
          >
            <MainHeading title={tradeHeading} />
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {tradeBullets.map((text, index) => (
                <Box
                  key={index}
                  component="li"
                  className="flex items-start gap-3"
                >
                  <Box
                    className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-1.5"
                    sx={{
                      backgroundColor: COLORS.primary,
                      color: COLORS.white,
                    }}
                  >
                    <CheckIcon />
                  </Box>
                  <ThemeText text={text} />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right: pink ellipse behind phones */}
          <Box
            component={motion.div}
            className="relative w-full md:w-[40%] flex items-center justify-end md:min-h-[350px] order-1 md:order-2"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={slideInRight}
          >
            <Box
              component="img"
              src={rightSideImage}
              alt={images.rightPhone || "PhotoMone Face Rank and Certificate"}
              className="relative z-10 w-full object-contain"
            />
          </Box>
        </Box>
      </Box>

      {/* FUSION section - gradient ellipse + LeftFusionImage left, bullet list right */}
      <Box
        component="section"
        className="w-full pt-10 md:pt-16 px-4 md:px-8 relative"
      >
        <Box className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <img
            src={gradientEllipse}
            alt=""
            aria-hidden
            className="absolute z-0 left-0 top-1/2 -translate-y-[30%] h-full object-contain"
          />

          {/* Left: gradient ellipse behind fusion image */}
          <Box
            component={motion.div}
            className="relative w-full md:w-[40%] flex items-center justify-start md:min-h-[350px]"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={slideInLeft}
          >
            <Box
              component="img"
              src={LeftFusionImage}
              alt={images.fusion || "Photo fusion examples"}
              className="relative z-10 w-full object-contain"
            />
          </Box>

          {/* Right: FUSION heading + bullet list (pink checkmarks) */}
          <Box
            component={motion.div}
            className="w-full md:w-[50%] flex flex-col text-left"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={slideInRight}
          >
            <MainHeading title={fusionHeading} />
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {fusionBullets.map((text, index) => (
                <Box
                  key={index}
                  component="li"
                  className="flex items-start gap-3"
                >
                  <Box
                    className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-1.5"
                    sx={{
                      backgroundColor: COLORS.secondary,
                      color: COLORS.white,
                    }}
                  >
                    <CheckIcon />
                  </Box>
                  <ThemeText text={text} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* FEATURES section*/}
      <Box
        component="section"
        className="w-full py-14 lg:py-20 px-4 md:px-8 mt-12 lg:mt-16"
        sx={{
          backgroundImage: `url(${featuresBg})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box
          component={motion.div}
          className="max-w-[1280px] mx-auto flex flex-col items-center text-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          <Box
            component={motion.div}
            variants={fadeInUp}
            className="text-center"
          >
            <LabelBadge label={featuresBadge} color={COLORS.secondary} />
            <MainHeading title={featuresTitle} />
          </Box>
          {/* Mobile / tablet: one card, all 6 bullets — no staggered offsets */}
          <Box
            component={motion.div}
            variants={fadeInUp}
            className="w-full mt-4 block lg:hidden"
          >
            <Box
              className="!bg-white rounded-2xl py-4 ps-4 pe-4 text-left w-full"
              sx={{
                boxShadow:
                  "0px -4px 0px 0px rgb(255, 255, 255), 0px 6px 0px 0px rgb(238, 237, 237), 0px 4px 0px 0px rgb(227, 227, 227)",
              }}
            >
              <Box className="flex flex-col gap-5">
                {[...featuresLeft, ...featuresRight].map((text, index) => (
                  <Typography
                    key={index}
                    component="div"
                    className="flex items-start flex-wrap gap-2 w-full leading-snug"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0 mt-1.5"
                      style={{ backgroundColor: COLORS.secondary }}
                    />
                    <ThemeText
                      text={text}
                      className="flex-shrink !m-0 !leading-snug !text-sm"
                    />
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Desktop (lg+): unchanged 3-column layout */}
          <Box
            component={motion.div}
            variants={fadeInUp}
            className="hidden lg:flex lg:flex-row items-center justify-center w-full mt-4"
          >
            {/* Left column: 3 feature badges */}
            <Box
              component={motion.div}
              variants={staggerContainer}
              className="flex flex-col gap-6 lg:gap-6.5 flex-1 mb-2 w-full justify-center"
            >
              {featuresLeft.map((text, index) => (
                <Box
                  key={index}
                  component={motion.div}
                  variants={fadeInScale}
                  className={`!bg-white rounded-2xl py-2.5 ps-4 pe-4 lg:pe-4 text-left lg:w-full  min-h-[5.75rem] flex items-start lg:items-center ${
                    index % 2 === 0 ? "me-12 lg:me-0" : "ms-12 lg:ms-0"
                  }`}
                  sx={{
                    boxShadow:
                      "0px -4px 0px 0px rgb(255, 255, 255), 0px 6px 0px 0px rgb(238, 237, 237), 0px 4px 0px 0px rgb(227, 227, 227)",
                  }}
                >
                  <Typography
                    component="div"
                    className="flex items-start flex-wrap lg:flex-nowrap gap-2 lg:gap-3 w-full lg:max-w-[260px] leading-snug"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0 mt-1.5"
                      style={{ backgroundColor: COLORS.secondary }}
                    />
                    <ThemeText
                      text={text}
                      className="flex-shrink !m-0 !leading-snug !text-sm lg:!text-[17px]"
                    />
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Center: PhotoMone shape image */}
            <Box
              component={motion.div}
              variants={fadeInScale}
              className="flex-1 lg:block hidden"
            >
              <Box
                component="img"
                src={photoMoneShape}
                alt={images.photoMoneShape || "PhotoMone"}
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </Box>

            {/* Right column: 3 feature badges */}
            <Box
              component={motion.div}
              variants={staggerContainer}
              className="flex flex-col gap-6 lg:gap-6.5 flex-1 w-full lg:mt-0 mt-4 justify-center"
            >
              {featuresRight.map((text, index) => (
                <Box
                  key={index}
                  component={motion.div}
                  variants={fadeInScale}
                  className={`!bg-white rounded-2xl py-2.5 ps-4 pe-4 lg:pe-4 text-left lg:w-full mx-auto lg:mx-0 min-h-[5.75rem] flex items-start lg:items-center ${
                    (index + 3) % 2 === 0 ? "me-12 lg:me-0" : "ms-12 lg:ms-0"
                  } lg:me-0`}
                  sx={{
                    boxShadow:
                      "0px -4px 0px 0px rgb(255, 255, 255), 0px 6px 0px 0px rgb(238, 237, 237), 0px 4px 0px 0px rgb(227, 227, 227)",
                  }}
                >
                  <Typography
                    component="div"
                    className="flex items-start flex-wrap lg:flex-nowrap gap-2 lg:gap-3 w-full lg:max-w-[260px] leading-snug"
                  >
                    <span
                      className=" h-2.5 w-2.5 rounded-full flex-shrink-0 mt-1.5"
                      style={{ backgroundColor: COLORS.secondary }}
                    />
                    <ThemeText
                      text={text}
                      className="flex-shrink !m-0 !leading-snug !text-sm lg:!text-[17px]"
                    />
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* HOW IT WORKS section */}
      <Box
        component="section"
        className="w-full py-20 md:py-24 px-4 md:px-8"
        sx={{ backgroundColor: COLORS.white, overflow: "visible" }}
      >
        <Box className="max-w-[1280px] mx-auto flex flex-col items-center">
          <motion.div
            className="text-center px-1"
            variants={fadeInUpHowItWorks}
            initial="hidden"
            whileInView="visible"
            viewport={viewportHowItWorks}
          >
            <LabelBadge
              label={landingHowItWorks?.badge || "Our Process"}
              color={COLORS.secondary}
            />
            <MainHeading title={landingHowItWorks?.title || "How It Works"} />
          </motion.div>
          <Box
            className="relative w-full mt-10 md:mt-14"
            sx={{ overflow: "visible" }}
          >
            {/* Mobile: simple left-aligned list — bullets only (no icons / arrows) */}
            {!isDesktop && (
              <Box
                component={motion.div}
                className="flex flex-col w-full text-left"
                variants={howItWorksStagger}
                initial="hidden"
                whileInView="visible"
                viewport={viewportHowItWorks}
                sx={{ gap: 2.5 }}
              >
                {howItWorksSteps.map((step, index) => (
                  <Box
                    key={index}
                    component={motion.div}
                    variants={fadeInUpHowItWorks}
                    className="flex items-start gap-2 w-full min-w-0"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0 mt-1.5"
                      style={{ backgroundColor: COLORS.secondary }}
                    />
                    <Box className="min-w-0 flex-1">
                      <Typography
                        component="div"
                        className="text-[15px] font-semibold mb-1 leading-snug"
                        sx={{ color: COLORS.generalText }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        className="text-[15px] leading-relaxed"
                        sx={{ color: COLORS.grayStrong }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {/* Desktop: timeline with left/right slots (only mount when >= md to avoid duplicate SVG ids) */}
            {isDesktop && (
              <Box
                component={motion.div}
                className="relative w-full"
                initial="hidden"
                whileInView="visible"
                viewport={viewportHowItWorks}
                variants={staggerContainer}
              >
                {/* Central vertical timeline — line draws down when section is in view */}
                <Box
                  component={motion.div}
                  className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-px overflow-hidden"
                  initial={{ height: "0%" }}
                  whileInView={{ height: "100%" }}
                  viewport={viewportHowItWorks}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 22,
                    delay: 0.1,
                  }}
                >
                  <Box
                    className="absolute left-0 top-0 w-px h-full"
                    sx={{
                      borderLeft: `1px dashed ${COLORS.darkBorder}`,
                    }}
                  />
                </Box>
                {howItWorksSteps.map((step, index) => (
                  <Box
                    key={index}
                    ref={(el) => {
                      stepRefs.current[index] = el as HTMLDivElement | null;
                    }}
                    component={motion.div}
                    variants={fadeInUpHowItWorks}
                    className="relative flex flex-col md:flex-row items-stretch md:items-center gap-12 md:gap-0"
                    sx={{
                      marginBottom: "2.5em",
                      "&:last-of-type": { marginBottom: 0 },
                    }}
                  >
                    {/* Left slot (step 1, 3, 5) — single structure with responsive order to avoid duplicate SVG ids */}
                    <Box className="flex-1 flex flex-col items-start lg:items-end lg:pr-12 order-2 md:order-1 justify-center">
                      {step.side === "left" ? (
                        <Box className="w-full flex flex-col lg:flex-row items-start gap-2 lg:gap-4 lg:items-center lg:justify-end lg:text-right">
                          <Box
                            className="rounded-3xl lg:rounded-4xl flex items-center justify-center flex-shrink-0 order-1 lg:order-2"
                            sx={{
                              width: { xs: 80, lg: 130 },
                              height: { xs: 70, lg: 110 },
                              pt: "4px",
                              transition: stepCardTransition,
                              backgroundColor:
                                index === activeStepIndex
                                  ? COLORS.secondary
                                  : "#F5F5F5",
                              boxShadow:
                                index === activeStepIndex
                                  ? "0px -4px 0px 0px rgb(255, 179, 186), 0px 6px 0px 0px rgb(254, 148, 159)"
                                  : "0px 2px 0px 0px rgb(238, 237, 237), 0px 6px 0px 0px rgb(227, 227, 227)",
                              "& svg": {
                                width: { xs: 38, lg: 60 },
                                height: { xs: 38, lg: 60 },
                                transition: stepIconTransition,
                              },
                            }}
                          >
                            <step.Icon
                              color={
                                index === activeStepIndex
                                  ? COLORS.white
                                  : "#262626"
                              }
                            />
                          </Box>
                          <Box className="order-2 lg:order-1 flex flex-col items-end">
                            <Typography
                              className="text-[1.8em] lg:text-[2.4em] mt-0 mt-3 lg:mt-0 mb-1 max-w-[370px]"
                              sx={{ color: COLORS.generalText }}
                            >
                              {step.title}
                            </Typography>
                            <Typography
                              className="text-[15px] lg:text-[17px]"
                              sx={{ color: COLORS.grayStrong }}
                            >
                              {step.description}
                            </Typography>
                          </Box>
                        </Box>
                      ) : null}
                    </Box>

                    {/* Center: timeline dot — pops in when in view, staggered by step */}
                    <Box
                      component={motion.div}
                      className="absolute left-1/2 top-2 -translate-x-[50%] flex-shrink-0 hidden lg:flex justify-center order-1 md:order-2 w-full md:w-6 z-1000"
                      initial={{ scale: 0.4, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={viewportHowItWorks}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 20,
                        delay: 0.15 + index * 0.12,
                      }}
                    >
                      <Box
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        sx={{
                          transition: stepDotTransition,
                          backgroundColor:
                            index === activeStepIndex ? "#FCC8CD" : "#909090",
                          boxShadow:
                            index === activeStepIndex
                              ? `0 0 0 5px #FDDDDF, 0 0 0 10px #FEF1F3`
                              : "0 0 0 5px #BABABA, 0 0 0 10px #E3E3E3",
                        }}
                      />
                    </Box>

                    {/* Right slot (step 2, 4, 6) — single structure with same responsive spacing, avoids duplicate SVG ids */}
                    <Box className="flex-1 flex flex-col items-start lg:items-end lg:pl-12 order-2 md:order-1 justify-center">
                      {step.side === "right" ? (
                        <Box className="w-full flex flex-col lg:flex-row items-start gap-2 lg:gap-4 lg:items-center lg:text-left">
                          <Box
                            className="rounded-3xl lg:rounded-4xl flex items-center justify-center flex-shrink-0 order-1"
                            sx={{
                              width: { xs: 80, lg: 130 },
                              height: { xs: 70, lg: 110 },
                              pt: "4px",
                              transition: stepCardTransition,
                              backgroundColor:
                                index === activeStepIndex
                                  ? COLORS.secondary
                                  : "#F5F5F5",
                              boxShadow:
                                index === activeStepIndex
                                  ? "0px -4px 0px 0px rgb(255, 179, 186), 0px 6px 0px 0px rgb(254, 148, 159)"
                                  : "0px 2px 0px 0px rgb(238, 237, 237), 0px 6px 0px 0px rgb(227, 227, 227)",
                              "& svg": {
                                width: { xs: 38, lg: 60 },
                                height: { xs: 38, lg: 60 },
                                transition: stepIconTransition,
                              },
                            }}
                          >
                            <step.Icon
                              color={
                                index === activeStepIndex
                                  ? COLORS.white
                                  : "#262626"
                              }
                            />
                          </Box>
                          <Box className="order-2">
                            <Typography
                              className="text-[1.8em] lg:text-[2.4em] mt-0 mt-3 lg:mt-0 mb-1 max-w-[350px]"
                              sx={{ color: COLORS.generalText }}
                            >
                              {step.title}
                            </Typography>
                            <Typography
                              className="text-[15px] lg:text-[17px]"
                              sx={{ color: COLORS.grayStrong }}
                            >
                              {step.description}
                            </Typography>
                          </Box>
                        </Box>
                      ) : null}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LandingScreen;
