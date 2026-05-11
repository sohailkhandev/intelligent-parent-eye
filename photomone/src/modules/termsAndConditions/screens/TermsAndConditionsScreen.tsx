import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import {
  HeroHeading,
  LabelBadge,
  ThemeText,
  MainHeading,
  PrincipleTitle,
  CheckListItem,
} from "@components";
import { COLORS } from "@constants";
import { useLanguage } from "@providers";
import heroBg from "@assets/images/heroBg.png";
import blueEllipse from "@assets/images/blueEllipse.png";
import pinkEllipse from "@assets/images/pinkEllipse.png";
/** Keep in sync with public/locales/en/termsAndConditions.json (runtime fetch + this merge fallback). */
import termsFallback from "../termsAndConditions.en.json";

type TermsContent = typeof termsFallback;

function deepMergeTerms(
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
      deepMergeTerms(tv as Record<string, unknown>, sv as Record<string, unknown>);
      continue;
    }
    if (typeof sv === "string" && sv === "") continue;
    target[key] = sv;
  }
}

function mergeTerms(overlay: unknown): TermsContent {
  const base = structuredClone(termsFallback) as unknown as Record<
    string,
    unknown
  >;
  if (overlay && typeof overlay === "object") {
    deepMergeTerms(base, overlay as Record<string, unknown>);
  }
  return base as TermsContent;
}

const Bold = ({ children }: { children: ReactNode }) => (
  <Box component="span" sx={{ fontWeight: 700, color: COLORS.generalText }}>
    {children}
  </Box>
);

export const TermsAndConditionsScreen = () => {
  const { translations } = useLanguage();
  const t = mergeTerms(translations?.termsAndConditions);

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
          <LabelBadge label={t.hero.badge} />
          <HeroHeading title={t.hero.titleFirst} lastWord={t.hero.titleLast} />
          <Box className="max-w-[800px] mt-2 mb-8 flex flex-col gap-4 text-center">
            <Typography
              className="text-sm lg:text-[17px] font-bold"
              sx={{ color: COLORS.secondary }}
            >
              {t.hero.lastUpdated}
            </Typography>
            <ThemeText
              text={
                <>
                  {t.hero.introBefore}
                  <Bold>{t.hero.introCompany}</Bold>
                  {t.hero.introAfter}
                </>
              }
            />
            <ThemeText text={t.hero.agree} />
            <ThemeText text={t.hero.disagree} />
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
          <MainHeading title={t.definitions.heading} />
          <Box
            component="ul"
            className="list-none p-0 m-0 flex flex-col gap-4 mt-6"
          >
            {t.definitions.items.map(({ term, text }, index) => (
              <CheckListItem key={index}>
                <Typography
                  className="text-sm lg:text-[17px] font-medium"
                  sx={{ color: COLORS.generalText }}
                >
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: COLORS.primary }}
                  >
                    {term}:
                  </Box>{" "}
                  {text}
                </Typography>
              </CheckListItem>
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
          <Box className="relative z-10 flex flex-col gap-4">
            <MainHeading title={t.natureOfService.heading} />
            <ThemeText text={t.natureOfService.lead} />
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.natureOfService.insteadLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.natureOfService.insteadItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.natureOfService.acknowledgeLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.natureOfService.acknowledgeItems.map((text, index) => (
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
            <MainHeading title={t.ownershipGenerated.heading} />
            <ThemeText text={t.ownershipGenerated.lead} />
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.ownershipGenerated.grantedLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.ownershipGenerated.grantedItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.ownershipGenerated.mayLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.ownershipGenerated.mayItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.ownershipGenerated.howeverLabel}
            </Typography>
123            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.ownershipGenerated.howeverItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.ownershipGenerated.jointLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.ownershipGenerated.jointItems.map((text, index) => (
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
            <MainHeading title={t.platformLicense.heading} />
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.platformLicense.allLicensesLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.platformLicense.allLicensesItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.platformLicense.mustNotLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.platformLicense.mustNotItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <ThemeText text={t.platformLicense.violation} />
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
            <MainHeading title={t.aiDisclaimer.heading} />
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.aiDisclaimer.allGenLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.aiDisclaimer.allGenItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.aiDisclaimer.resemblanceLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.aiDisclaimer.resemblanceItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.aiDisclaimer.companyLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.aiDisclaimer.companyItems.map((text, index) => (
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
            <MainHeading title={t.userInputResponsibility.heading} />
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.userInputResponsibility.mustLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.userInputResponsibility.mustItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.userInputResponsibility.responsibleLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.userInputResponsibility.responsibleItems.map((text, index) => (
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
            <MainHeading title={t.aiProcessingData.heading} />
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.aiProcessingData.grantLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.aiProcessingData.grantItems.map((text, index) => (
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
            <MainHeading title={t.pointsGiftCards.heading} />
            <PrincipleTitle>{t.pointsGiftCards.pointsTitle}</PrincipleTitle>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.pointsGiftCards.pointsItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <PrincipleTitle>{t.pointsGiftCards.giftCardsTitle}</PrincipleTitle>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.pointsGiftCards.giftCardsItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.pointsGiftCards.companyMayLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.pointsGiftCards.companyMayItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <PrincipleTitle>{t.pointsGiftCards.processingTitle}</PrincipleTitle>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.pointsGiftCards.processingItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.pointsGiftCards.usersAckLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.pointsGiftCards.usersAckItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <PrincipleTitle>{t.pointsGiftCards.noRefundsTitle}</PrincipleTitle>
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.pointsGiftCards.noRefundsLead}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.pointsGiftCards.noRefundsItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <PrincipleTitle>
              {t.pointsGiftCards.noFinancialTitle}
            </PrincipleTitle>
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {t.pointsGiftCards.noFinancialLead}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.pointsGiftCards.noFinancialItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <PrincipleTitle>
              {t.pointsGiftCards.liabilityCapTitle}
            </PrincipleTitle>
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {t.pointsGiftCards.liabilityCapLead}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.pointsGiftCards.liabilityCapItems.map((text, index) => (
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
            <MainHeading title={t.exposureSystem.heading} />
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {t.exposureSystem.whenLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.exposureSystem.whenItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {t.exposureSystem.agreeLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.exposureSystem.agreeItems.map((text, index) => (
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
            <MainHeading title={t.externalTransactions.heading} />
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.externalTransactions.mustNotLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.externalTransactions.mustNotItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <ThemeText text={t.externalTransactions.outside} />
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
            <MainHeading title={t.sponsoredContent.heading} />
            <ThemeText text={t.sponsoredContent.sponsorLead} />
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.sponsoredContent.notLiableLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.sponsoredContent.notLiableItems.map((text, index) => (
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
            <MainHeading title={t.serviceModifications.heading} />
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.serviceModifications.companyMayLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.serviceModifications.companyMayItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <ThemeText text={t.serviceModifications.anyTime} />
            <Typography
              className="text-sm lg:text-[17px]"
              sx={{ fontWeight: 700, color: COLORS.generalText }}
            >
              {t.serviceModifications.usersAgreeLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.serviceModifications.usersAgreeItems.map((text, index) => (
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
            <MainHeading title={t.futureFeatures.heading} />
            <ThemeText text={t.futureFeatures.intro} />
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {t.futureFeatures.companyLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.futureFeatures.companyItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {t.futureFeatures.usersAgreeLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.futureFeatures.usersAgreeItems.map((text, index) => (
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
            <MainHeading title={t.prohibitedConduct.heading} />
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {t.prohibitedConduct.mustNotLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.prohibitedConduct.mustNotItems.map((text, index) => (
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
            <MainHeading title={t.serviceAvailability.heading} />
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {t.serviceAvailability.companyMayLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.serviceAvailability.companyMayItems.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {t.serviceAvailability.noGuaranteeLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.serviceAvailability.noGuaranteeItems.map((text, index) => (
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
            <MainHeading title={t.disclaimerLiability.heading} />
            <ThemeText text={t.disclaimerLiability.asIs} />
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {t.disclaimerLiability.extentLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.disclaimerLiability.extentItems.map((text, index) => (
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
            <MainHeading title={t.indemnification.heading} />
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {t.indemnification.agreeLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.indemnification.agreeItems.map((text, index) => (
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
            <MainHeading title={t.lawEnforcement.heading} />
            <Typography
              className="text-sm lg:text-[17px] font-medium"
              sx={{ color: COLORS.generalText }}
            >
              {t.lawEnforcement.companyMayLabel}
            </Typography>
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.lawEnforcement.companyMayItems.map((text, index) => (
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
          <MainHeading title={t.governingLaw.heading} />
          <Box className="mt-2">
            <ThemeText text={t.governingLaw.body} />
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
          <MainHeading title={t.contactInfo.heading} />
          <Box className="mt-2 flex flex-col gap-2">
            <ThemeText text={t.contactInfo.companyName} />
            <ThemeText text={t.contactInfo.address} />
            <Box className="flex flex-wrap items-baseline gap-1">
              <Typography
                component="span"
                className="text-sm lg:text-[17px] font-medium"
                sx={{ color: COLORS.generalText }}
              >
                {t.contactInfo.emailLabel}{" "}
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
            <MainHeading title={t.finalAcknowledgment.heading} />
            <ThemeText text={t.finalAcknowledgment.intro} />
            <Box
              component="ul"
              className="list-none p-0 m-0 flex flex-col gap-3"
            >
              {t.finalAcknowledgment.items.map((text, index) => (
                <CheckListItem key={index} text={text} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TermsAndConditionsScreen;
