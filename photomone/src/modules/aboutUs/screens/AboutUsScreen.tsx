import { Box, Typography } from "@mui/material";
import { COLORS } from "@constants";
import {
  HeroHeading,
  LabelBadge,
  ThemeText,
  MainHeading,
  PrincipleTitle,
  CheckListItem,
} from "@components";
import { useLanguage } from "@providers";
import heroBg from "@assets/images/heroBg.png";
import blueEllipse from "@assets/images/blueEllipse.png";
import pinkEllipse from "@assets/images/pinkEllipse.png";

type AboutHighlight = { before?: string; emphasis?: string; after?: string };

type AboutUsCopy = {
  hero?: {
    badge?: string;
    titleFirst?: string;
    titleLast?: string;
    lead?: string;
    mission?: string;
    marketplace?: string;
  };
  corePrinciples?: {
    heading?: string;
    intro?: string;
    items?: { title?: string; body?: string }[];
  };
  valueCreation?: {
    heading?: string;
    intro?: string;
    bullets?: string[];
    closing?: string;
  };
  positioning?: {
    heading?: string;
    notLabel?: string;
    notItems?: string[];
    isLabel?: string;
    isItems?: string[];
    closing?: string;
  };
  capabilities?: {
    heading?: string;
    intro?: string;
    bullets?: string[];
  };
  commitment?: {
    heading?: string;
    intro?: string;
    highlights?: AboutHighlight[];
    items?: string[];
    closing?: string;
  };
  purpose?: {
    heading?: string;
    intro?: string;
    outroBefore?: string;
    outroEmphasis?: string;
  };
};

const FALLBACK: AboutUsCopy = {
  hero: {
    badge: "About Us",
    titleFirst: "ABOUT",
    titleLast: "US",
    lead: "PhotoMone is a portrait usage trading platform designed to create measurable economic value for users.",
    mission:
      "Our mission is clear and deliberate: to enable individuals to generate financial value through the structured use, evaluation, and transformation of portrait usage rights.",
    marketplace:
      "At its core, PhotoMone provides a controlled marketplace where users can trade portrait usage rights—both their own and those acquired from others—within a transparent and rule-based system. Through participation in this system, users are able to convert engagement into tangible economic outcomes.",
  },
  corePrinciples: {
    heading: "Core Principles",
    intro: "PhotoMone is built on three fundamental principles:",
    items: [
      {
        title: "1. Portrait usage rights as economic assets",
        body: "Portraits are treated as tradable digital assets whose value is determined through platform activity rather than subjective opinion.",
      },
      {
        title: "2. Objective face evaluation through market data",
        body: "Faces are evaluated based on real transaction data, exposure frequency, and market conditions, allowing users to understand the relative value of their portraits through objective metrics.",
      },
      {
        title: "3. Value creation through transformation",
        body: "Beyond trading, PhotoMone enables users to increase the value of portraits through photo fusion, allowing eligible images to be combined and transformed into higher-value assets.",
      },
    ],
  },
  valueCreation: {
    heading: "How Value Is Created on PhotoMone",
    intro: "Users participate in a structured process that generates economic value:",
    bullets: [
      "By purchasing portrait usage rights from other users, participants gain the opportunity to offer their own portrait usage rights under equivalent conditions.",
      "Transactions generate points, which represent accumulated economic value within the platform.",
      "Portraits are continuously evaluated based on transaction activity, providing users with clear face rankings and evaluation data.",
      "Through photo fusion, users can enhance the value of existing portraits, creating new assets with higher market potential.",
    ],
    closing:
      "The creation and delivery of photo-based value to users is PhotoMone's highest priority as a company.",
  },
  positioning: {
    heading: "What PhotoMone Is — and Is Not",
    notLabel: "PhotoMone is not:",
    notItems: [
      "a social media platform,",
      "a popularity contest,",
      "a service driven by followers, fame, or influence.",
    ],
    isLabel: "PhotoMone is:",
    isItems: [
      "a system focused on economic participation,",
      "a marketplace governed by transparent rules,",
      "a platform where value is created through action, not perception.",
    ],
    closing:
      "Participation does not depend on appearance, popularity, or background. It depends solely on how users engage with the system.",
  },
  capabilities: {
    heading: "What Users Can Do on PhotoMone",
    intro: "With PhotoMone, users can:",
    bullets: [
      "Trade portrait usage rights within a controlled marketplace",
      "Receive objective face evaluations based on real transaction data",
      "Increase photo value through photo fusion mechanisms",
      "Resell purchased portrait usage rights to generate returns",
      "Earn points through trading and platform activities",
      "Redeem earned points for gift cards and other economic benefits",
    ],
  },
  commitment: {
    heading: "Our Commitment",
    intro: "PhotoMone is committed to:",
    highlights: [
      {
        before: "Delivering ",
        emphasis: "real economic benefits",
        after: " to users",
      },
      {
        before: "Operating a ",
        emphasis: "transparent and structured trading system",
        after: "",
      },
    ],
    items: [
      "Continuously expanding features that support user-driven value creation",
      "Providing accessible tools that allow participation regardless of appearance or background",
    ],
    closing:
      "As the platform grows, additional systems and services will be introduced to further enhance users' ability to generate value from their participation.",
  },
  purpose: {
    heading: "Our Purpose",
    intro:
      "PhotoMone exists to help users turn participation into opportunity—and opportunity into reward.",
    outroBefore:
      "If your goal is to benefit economically through portrait usage trading, face evaluation, and photo value creation, ",
    outroEmphasis: "PhotoMone is where you begin.",
  },
};

function mergeAbout(raw: unknown): AboutUsCopy {
  const r = (raw && typeof raw === "object" ? raw : {}) as AboutUsCopy;
  const deep = <T extends Record<string, unknown>>(base: T, over: Partial<T>): T =>
    ({ ...base, ...Object.fromEntries(Object.entries(over).filter(([, v]) => v != null && v !== "")) } as T);
  return {
    hero: deep(FALLBACK.hero!, r.hero || {}),
    corePrinciples: {
      ...FALLBACK.corePrinciples!,
      ...(r.corePrinciples || {}),
      items:
        Array.isArray(r.corePrinciples?.items) && r.corePrinciples!.items!.length > 0
          ? r.corePrinciples!.items!
          : FALLBACK.corePrinciples!.items,
    },
    valueCreation: {
      ...FALLBACK.valueCreation!,
      ...(r.valueCreation || {}),
      bullets:
        Array.isArray(r.valueCreation?.bullets) && r.valueCreation!.bullets!.length > 0
          ? r.valueCreation!.bullets!
          : FALLBACK.valueCreation!.bullets,
    },
    positioning: {
      ...FALLBACK.positioning!,
      ...(r.positioning || {}),
      notItems:
        Array.isArray(r.positioning?.notItems) && r.positioning!.notItems!.length > 0
          ? r.positioning!.notItems!
          : FALLBACK.positioning!.notItems,
      isItems:
        Array.isArray(r.positioning?.isItems) && r.positioning!.isItems!.length > 0
          ? r.positioning!.isItems!
          : FALLBACK.positioning!.isItems,
    },
    capabilities: {
      ...FALLBACK.capabilities!,
      ...(r.capabilities || {}),
      bullets:
        Array.isArray(r.capabilities?.bullets) && r.capabilities!.bullets!.length > 0
          ? r.capabilities!.bullets!
          : FALLBACK.capabilities!.bullets,
    },
    commitment: {
      ...FALLBACK.commitment!,
      ...(r.commitment || {}),
      highlights:
        Array.isArray(r.commitment?.highlights) && r.commitment!.highlights!.length > 0
          ? r.commitment!.highlights!
          : FALLBACK.commitment!.highlights,
      items:
        Array.isArray(r.commitment?.items) && r.commitment!.items!.length > 0
          ? r.commitment!.items!
          : FALLBACK.commitment!.items,
    },
    purpose: deep(FALLBACK.purpose!, r.purpose || {}),
  };
}

export const AboutUsScreen = () => {
  const { translations } = useLanguage();
  const a = mergeAbout(translations?.aboutUs);

  const hero = a.hero!;
  const corePrinciples = a.corePrinciples!;
  const valueCreation = a.valueCreation!;
  const positioning = a.positioning!;
  const capabilities = a.capabilities!;
  const commitment = a.commitment!;
  const purpose = a.purpose!;

  return (
    <>
      <Box
        component="section"
        className="relative flex items-center justify-center overflow-hidden pt-30 pb-15 min-h-[400px] lg:min-h-[80vh]"
        sx={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box className="relative z-10 flex flex-col items-center max-w-[900px] mx-auto text-center px-4">
          <LabelBadge label={hero.badge!} />
          <HeroHeading title={hero.titleFirst!} lastWord={hero.titleLast!} underlineUnderTitle />
          <Box className="max-w-[800px] mt-2 mb-8 flex flex-col gap-4 text-center">
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.secondary }}
            >
              {hero.lead}
            </Typography>
            <ThemeText text={hero.mission!} />
            <ThemeText text={hero.marketplace!} />
          </Box>
        </Box>
      </Box>

      <Box component="section" className="w-full px-4 md:px-8">
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <MainHeading title={corePrinciples.heading!} />
          <Box className="mt-2 mb-6">
            <ThemeText text={corePrinciples.intro!} />
          </Box>
          <Box className="flex flex-col gap-6">
            {corePrinciples.items!.map((item, index) => (
              <Box key={index}>
                <PrincipleTitle>{item.title}</PrincipleTitle>
                <ThemeText text={item.body!} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box component="section" className="relative w-full px-4 md:px-8">
        <Box
          component="img"
          src={blueEllipse}
          alt=""
          aria-hidden
          className="absolute z-0 left-0 top-1/2 -translate-y-[30%] h-full object-contain pointer-events-none"
        />
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <Box className="relative z-10">
            <MainHeading title={valueCreation.heading!} />
            <Box className="mt-2 mb-6">
              <ThemeText text={valueCreation.intro!} />
            </Box>
            <Box component="ul" className="list-none p-0 m-0 flex flex-col gap-3 mb-6">
              {valueCreation.bullets!.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <ThemeText text={valueCreation.closing!} />
          </Box>
        </Box>
      </Box>

      <Box component="section" className="w-full px-4 md:px-8">
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <MainHeading title={positioning.heading!} />
          <Typography
            className="text-sm lg:text-[17px] mb-2 mt-6"
            sx={{ fontWeight: 700, color: COLORS.generalText }}
          >
            {positioning.notLabel}
          </Typography>
          <Box component="ul" className="list-none p-0 m-0 flex flex-col gap-3 mb-6">
            {positioning.notItems!.map((text, index) => (
              <CheckListItem key={index} text={text} />
            ))}
          </Box>
          <Typography
            className="text-sm lg:text-[17px] mb-2"
            sx={{ fontWeight: 700, color: COLORS.generalText }}
          >
            {positioning.isLabel}
          </Typography>
          <Box component="ul" className="list-none p-0 m-0 flex flex-col gap-3 mb-6">
            {positioning.isItems!.map((text, index) => (
              <CheckListItem key={index} text={text} />
            ))}
          </Box>
          <ThemeText text={positioning.closing!} />
        </Box>
      </Box>

      <Box component="section" className="relative w-full px-4 md:px-8">
        <Box
          component="img"
          src={pinkEllipse}
          alt=""
          aria-hidden
          className="absolute z-0 right-0 top-0  h-full object-contain pointer-events-none"
        />
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <Box className="relative z-10">
            <MainHeading title={capabilities.heading!} />
            <Box className="mt-2 mb-6">
              <ThemeText text={capabilities.intro!} />
            </Box>
            <Box component="ul" className="list-none p-0 m-0 flex flex-col gap-3">
              {capabilities.bullets!.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box component="section" className="w-full px-4 md:px-8">
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <MainHeading title={commitment.heading!} />
          <Box className="mt-2 mb-6">
            <ThemeText text={commitment.intro!} />
          </Box>
          <Box component="ul" className="list-none p-0 m-0 flex flex-col gap-3 mb-6">
            {commitment.highlights!.map((hl, index) => (
              <CheckListItem key={`h-${index}`}>
                <Typography
                  className="text-sm lg:text-[17px] font-medium"
                  sx={{ color: COLORS.generalText }}
                >
                  {hl.before}
                  <Box component="span" sx={{ color: COLORS.primary }}>
                    {hl.emphasis}
                  </Box>
                  {hl.after}
                </Typography>
              </CheckListItem>
            ))}
            {commitment.items!.map((text, index) => (
              <CheckListItem key={index} text={text} />
            ))}
          </Box>
          <ThemeText text={commitment.closing!} />
        </Box>
      </Box>

      <Box component="section" className="relative w-full px-4 md:px-8">
        <Box
          component="img"
          src={blueEllipse}
          alt=""
          aria-hidden
          className="absolute z-0 left-0 top-1/2 -translate-y-[30%] h-full object-contain pointer-events-none"
        />
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <Box className="relative z-10">
            <MainHeading title={purpose.heading!} />
            <Box className="mt-2 mb-4">
              <ThemeText text={purpose.intro!} />
            </Box>
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {purpose.outroBefore}
              <Box component="span" sx={{ color: COLORS.primary }}>
                {purpose.outroEmphasis}
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AboutUsScreen;
