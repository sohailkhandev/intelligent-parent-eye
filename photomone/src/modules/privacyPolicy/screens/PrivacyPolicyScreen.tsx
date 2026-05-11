import type { ReactNode } from "react";
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
import blueEllipse from "@assets/images/blueEllipse.png";
import pinkEllipse from "@assets/images/pinkEllipse.png";
import heroBg from "@assets/images/heroBg.png";
/** Keep in sync with public/locales/en/privacyPolicy.json (runtime fetch + this merge fallback). */
import privacyPolicyFallback from "../privacyPolicy.en.json";

type PrivacyPolicyContent = typeof privacyPolicyFallback;

function deepMergePrivacy(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): void {
  for (const key of Object.keys(source)) {
    const sv = source[key];
    if (sv === undefined || sv === null) continue;
    const tv = target[key];
    if (Array.isArray(sv)) {
      if (sv.length > 0) target[key] = sv;
      continue;
    }
    if (
      typeof sv === "object" &&
      typeof tv === "object" &&
      tv !== null &&
      !Array.isArray(tv) &&
      !Array.isArray(sv)
    ) {
      deepMergePrivacy(tv as Record<string, unknown>, sv as Record<string, unknown>);
      continue;
    }
    if (typeof sv === "string" && sv === "") continue;
    target[key] = sv;
  }
}

function mergePrivacyPolicy(overlay: unknown): PrivacyPolicyContent {
  const base = structuredClone(privacyPolicyFallback) as unknown as Record<
    string,
    unknown
  >;
  if (overlay && typeof overlay === "object") {
    deepMergePrivacy(base, overlay as Record<string, unknown>);
  }
  return base as PrivacyPolicyContent;
}

const Bold = ({ children }: { children: ReactNode }) => (
  <Box component="span" sx={{ fontWeight: 700, color: COLORS.generalText }}>
    {children}
  </Box>
);

export const PrivacyPolicyScreen = () => {
  const { translations } = useLanguage();
  const p = mergePrivacyPolicy(translations?.privacyPolicy);

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
          <LabelBadge label={p.hero.badge} />
          <HeroHeading title={p.hero.titleFirst} lastWord={p.hero.titleLast} />
          <Box className="max-w-[800px] mt-2 mb-8 flex flex-col gap-4 text-center">
            <Typography
              className="text-sm lg:text-[17px] font-bold"
              sx={{ color: COLORS.secondary }}
            >
              {p.hero.lastUpdated}
            </Typography>
            <ThemeText
              text={
                <>
                  {p.hero.introBefore}
                  <Bold>{p.hero.introCompany}</Bold>
                  {p.hero.introAfter}
                </>
              }
            />
            <ThemeText text={p.hero.agree} />
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
          <Box className="relative z-10 flex flex-col gap-4">
            <MainHeading title={p.overview.heading} />
            <ThemeText
              text={
                <>
                  {p.overview.leadBefore}
                  <Bold>{p.overview.leadEmphasis}</Bold>
                  {p.overview.leadAfter}
                </>
              }
            />
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.overview.bullets.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box component="section" className="relative w-full px-4 md:px-8">
        <Box
          component="img"
          src={pinkEllipse}
          alt=""
          aria-hidden
          className="absolute z-0 right-0 top-1/2 -translate-y-[30%] h-full object-contain pointer-events-none"
        />
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <Box className="relative z-10 flex flex-col gap-4">
            <MainHeading title={p.informationCollect.heading} />

            <PrincipleTitle>{p.informationCollect.personalTitle}</PrincipleTitle>
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.informationCollect.weMayCollect}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.informationCollect.personalItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>

            <PrincipleTitle>{p.informationCollect.userContentTitle}</PrincipleTitle>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.informationCollect.userContentItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>

            <PrincipleTitle>{p.informationCollect.autoTitle}</PrincipleTitle>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.informationCollect.autoItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
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
          <Box className="relative z-10 flex flex-col gap-4">
            <MainHeading title={p.howWeUse.heading} />
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.howWeUse.weUseTo}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.howWeUse.bullets.map((text, index) => (
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
          <Box className="flex flex-col gap-4">
            <MainHeading title={p.aiProcessing.heading} />
            <ThemeText text={p.aiProcessing.explicitAgree} />
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              <CheckListItem text={p.aiProcessing.bulletProcessAi} />
              <CheckListItem text={p.aiProcessing.bulletTransformSynthetic} />
              <CheckListItem>
                <Box>
                  <ThemeText text={p.aiProcessing.generatedContentTitle} />
                  <Box
                    component="ul"
                    className="list-disc list-outside pl-5 md:pl-12 mt-2 flex flex-col gap-2"
                    sx={{ color: COLORS.generalText }}
                  >
                    {p.aiProcessing.generatedContentPoints.map((pt, index) => (
                      <Box component="li" key={index}>
                        <ThemeText text={pt} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </CheckListItem>
            </Box>
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.aiProcessing.companyMayUse}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.aiProcessing.contentLabels.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.aiProcessing.forLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.aiProcessing.purposeItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box component="section" className="relative w-full px-4 md:px-8">
        <Box
          component="img"
          src={pinkEllipse}
          alt=""
          aria-hidden
          className="absolute z-0 right-0 top-1/2 -translate-y-[30%] h-full object-contain pointer-events-none"
        />
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <Box className="relative z-10 flex flex-col gap-4">
            <MainHeading title={p.anonymization.heading} />
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.anonymization.appliesIncluding}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.anonymization.processItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.anonymization.ensureLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.anonymization.ensureItems.map((text, index) => (
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
          <Box className="flex flex-col gap-4">
            <MainHeading title={p.sharing.heading} />
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.sharing.weMayShare}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.sharing.bullets.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <ThemeText text={p.sharing.noSell} />
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
          <Box className="relative z-10 flex flex-col gap-4">
            <MainHeading title={p.storage.heading} />
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.storage.safeguards}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.storage.safeguardItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.storage.however}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.storage.howeverItems.map((text, index) => (
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
          <Box className="flex flex-col gap-4">
            <MainHeading title={p.retention.heading} />
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.retention.weRetain}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.retention.retainBullets.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.retention.weMayRetain}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.retention.retainTypes.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <ThemeText text={p.retention.inactiveNote} />
          </Box>
        </Box>
      </Box>

      <Box component="section" className="relative w-full px-4 md:px-8">
        <Box
          component="img"
          src={pinkEllipse}
          alt=""
          aria-hidden
          className="absolute z-0 right-0 top-1/2 -translate-y-[30%] h-full object-contain pointer-events-none"
        />
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <Box className="relative z-10 flex flex-col gap-4">
            <MainHeading title={p.userRights.heading} />
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.userRights.underLaws}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.userRights.rightsItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.userRights.howeverAck}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.userRights.ackItems.map((text, index) => (
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
          <Box className="flex flex-col gap-4">
            <MainHeading title={p.cookies.heading} />
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.cookies.weMayUse}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.cookies.toolsItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.cookies.toLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.cookies.toItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <ThemeText text={p.cookies.browserNote} />
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
          <Box className="flex flex-col gap-4">
            <MainHeading title={p.thirdParty.heading} />
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {p.thirdParty.mayRely}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.thirdParty.bullets.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <ThemeText text={p.thirdParty.processNote} />
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
          <Box className="flex flex-col gap-4">
            <MainHeading title={p.children.heading} />
            <ThemeText text={p.children.notUnder18} />
            <ThemeText text={p.children.noMinors} />
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
          <Box className="flex flex-col gap-4">
            <MainHeading title={p.changes.heading} />
            <ThemeText text={p.changes.mayUpdate} />
            <ThemeText text={p.changes.effectivePosting} />
            <ThemeText text={p.changes.reviewResponsibility} />
          </Box>
        </Box>
      </Box>

      <Box component="section" className="relative w-full px-4 md:px-8">
        <Box
          component="img"
          src={pinkEllipse}
          alt=""
          aria-hidden
          className="absolute z-0 right-0 top-1/2 -translate-y-[30%] h-full object-contain pointer-events-none"
        />
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          <Box className="relative z-10 flex flex-col gap-2">
            <MainHeading title={p.contact.heading} />
            <ThemeText text={p.contact.company} />
            <ThemeText text={p.contact.address} />
            <Box className="flex flex-wrap items-baseline gap-1">
              <Typography
                component="span"
                className="text-sm lg:text-[17px] font-medium"
                sx={{ color: COLORS.generalText }}
              >
                {p.contact.emailLabel}
              </Typography>
              <Box
                component="a"
                href="mailto:support@photomone.com"
                className="text-sm lg:text-[17px] font-medium"
                sx={{ color: COLORS.primary, textDecoration: "underline" }}
              >
                support@photomone.com
              </Box>
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
          <Box className="flex flex-col gap-4">
            <MainHeading title={p.finalAck.heading} />
            <ThemeText text={p.finalAck.byUsing} />
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {p.finalAck.bullets.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PrivacyPolicyScreen;
