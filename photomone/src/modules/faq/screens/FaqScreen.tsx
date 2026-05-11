import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HeroHeading,
  LabelBadge,
  MainButton,
  MainHeading,
  ThemeText,
} from "@components";
import { COLORS, ROUTES } from "@constants";
import { useLanguage } from "@providers";
import heroBg from "@assets/images/heroBg.png";
import sectionBg from "@assets/images/sectionBg.jpg";

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MinusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/** Inline **bold** in FAQ strings — max weight 600 to match app emphasis. */
const renderAnswerWithBold = (text: string): ReactNode => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const inner = part.slice(2, -2);
      return (
        <Box
          key={i}
          component="span"
          sx={{ fontWeight: 600, color: "inherit" }}
        >
          {inner}
        </Box>
      );
    }
    return part;
  });
};

export const FaqScreen = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const faq = translations?.faq || {};
  const legacyFaqs = (faq.faqs as Record<string, unknown>[]) || [];
  const rawCategories = faq.categories as
    | { title?: string; faqs?: Record<string, unknown>[] }[]
    | undefined;
  const categories =
    Array.isArray(rawCategories) && rawCategories.length > 0
      ? rawCategories
      : [{ title: "", faqs: legacyFaqs }];
  const support = (faq.support || {}) as Record<string, string | undefined>;
  const faqHero = faq.hero as
    | { badge?: string; titleBefore?: string; titleLast?: string }
    | undefined;
  const heroBadge = faqHero?.badge ?? "FAQs";
  const heroTitleBefore = faqHero?.titleBefore ?? "PhotoMone User";
  const heroTitleLast = faqHero?.titleLast ?? "FAQs";
  const supportSectionBadge = support.sectionBadge ?? "Support";

  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const faqKey = (catIdx: number, faqIdx: number) => `${catIdx}-${faqIdx}`;

  const toggleFaq = (catIdx: number, faqIdx: number) => {
    const key = faqKey(catIdx, faqIdx);
    setOpenFaq(openFaq === key ? null : key);
  };

  const renderAnswer = (item: Record<string, unknown>): ReactNode => {
    if (item.answerLinkText) {
      return (
        <>
          {item.answerBeforeLink}
          <Box
            component="span"
            onClick={() => navigate("/dashboard/result")}
            sx={{
              color: COLORS.primary,
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {String(item.answerLinkText ?? "")}
          </Box>{" "}
          {item.answerAfterLink}
          {(item.answerBullets as string[])?.length > 0 && (
            <>
              <br />
              {(item.answerBullets as string[]).map((bullet, i) => (
                <span key={i}>
                  • {bullet}
                  <br />
                </span>
              ))}
            </>
          )}
        </>
      );
    }
    const plain = String(item.answer ?? "");
    return renderAnswerWithBold(plain);
  };

  return (
    <>
      {/* Hero section - same responsive pattern as How It Works */}
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
          <LabelBadge label={heroBadge} />
          <HeroHeading title={heroTitleBefore} lastWord={heroTitleLast} />
          {support.subtitle && (
            <Typography
              className="text-sm lg:text-[17px] font-medium mt-2 mb-8 max-w-[800px]"
              sx={{ color: COLORS.secondary }}
            >
              {support.subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {/* FAQ content - same section wrap pattern as About Us */}
      <Box component="section" className="w-full px-4 md:px-8">
        <Box
          className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16"
          sx={{
            color: COLORS.generalText,
            borderBottom: `1px solid ${COLORS.grayLight}`,
          }}
        >
          {/* FAQ by category — h3 headings, dividers between categories */}
          {categories.map(
            (
              cat: { title?: string; faqs?: Record<string, unknown>[] },
              catIdx: number
            ) => {
              const items = cat.faqs || [];
              if (items.length === 0) return null;
              return (
                <Box
                  key={catIdx}
                  className={catIdx > 0 ? "mt-10 pt-10" : ""}
                  sx={
                    catIdx > 0
                      ? {
                          borderTop: `1px solid ${COLORS.grayLight}`,
                        }
                      : undefined
                  }
                >
                  {cat.title ? (
                    <Typography
                      component="h3"
                      className="mb-6 text-left"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: "1.125rem", md: "1.25rem" },
                        color: COLORS.generalText,
                      }}
                    >
                      {cat.title}
                    </Typography>
                  ) : null}
                  <Box className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 items-start">
                    {items.map(
                      (item: Record<string, unknown>, faqIdx: number) => {
                        const key = faqKey(catIdx, faqIdx);
                        return (
                          <Box
                            key={key}
                            className="rounded-2xl overflow-hidden !bg-[#F4F4F5]"
                            sx={{
                              boxShadow:
                                "0px 2px 0px 0px rgb(238, 237, 237), 0px 6px 0px 0px rgb(227, 227, 227), 0px 0px 40px 10px rgba(0, 0, 0,0.05)",
                            }}
                          >
                            <Box
                              component="button"
                              onClick={() => toggleFaq(catIdx, faqIdx)}
                              className="w-full text-left px-8 py-3 focus:outline-none bg-transparent border-0 cursor-pointer"
                            >
                              <Box className="flex justify-between items-center gap-3">
                                <Typography
                                  component="span"
                                  className="text-sm lg:text-[17px]"
                                  sx={{
                                    fontWeight: 600,
                                    color: COLORS.generalText,
                                  }}
                                >
                                  {String(item.question ?? "")}
                                </Typography>
                                <Box
                                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                                  sx={{
                                    backgroundColor: COLORS.generalText,
                                    color: COLORS.white,
                                  }}
                                >
                                  {openFaq === key ? (
                                    <MinusIcon className="text-white" />
                                  ) : (
                                    <PlusIcon className="text-white" />
                                  )}
                                </Box>
                              </Box>
                            </Box>

                            {openFaq === key && (
                              <Box
                                className="px-5 pb-4"
                                sx={{
                                  borderTop: `1px solid ${COLORS.grayLight}`,
                                }}
                              >
                                <Box
                                  component="p"
                                  className="pt-3 pl-0 text-sm lg:text-[17px] font-medium m-0"
                                  sx={{ color: COLORS.generalText }}
                                >
                                  {renderAnswer(item)}
                                </Box>
                              </Box>
                            )}
                          </Box>
                        );
                      }
                    )}
                  </Box>
                </Box>
              );
            }
          )}

          {/* Customer Support - rounded container, light pink/purple bg, "< Support", title, email link, gradient button */}
          <Box
            className="rounded-2xl px-4 py-12 lg:py-16 text-center w-full max-w-[1280px] mx-auto"
            sx={{
              backgroundImage: `url(${sectionBg})`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              boxShadow: "0 4px 14px rgba(250, 148, 157, 0.12)",
            }}
          >
            <Box
              component="button"
              onClick={() => navigate(ROUTES.customerSupport)}
              className="mb-2 bg-transparent border-0 cursor-pointer p-0"
              sx={{ color: COLORS.secondary, "&:hover": { opacity: 0.85 } }}
            >
              <LabelBadge label={supportSectionBadge} color={COLORS.secondary} />
            </Box>
            <MainHeading
              title={support.question ?? "How can I get customer support?"}
            />
            <ThemeText
              text={support.text ?? "Please contact our support team:"}
              className="text-lg"
            />
            <Box
              component="a"
              className="text-lg"
              href="mailto:support@photomone.com"
              sx={{
                color: COLORS.primary,
                "&:hover": { opacity: 0.9 },
              }}
            >
              {support.email ?? "support@photomone.com"}
            </Box>
            <Box className="mt-6">
              <MainButton onClick={() => navigate(ROUTES.customerSupport)}>
                {support.button ?? "Contact Support"}
              </MainButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default FaqScreen;
