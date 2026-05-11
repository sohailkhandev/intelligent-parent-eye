import { Box, Typography } from "@mui/material";
import { COLORS } from "@constants";
import { HeroHeading, LabelBadge, ThemeText } from "@components";
import heroBg from "@assets/images/heroBg.png";

export interface BlogHeroProps {
  badge: string;
  titleFirst: string;
  titleLast: string;
  /** Shown in secondary color below the main heading */
  lead: string;
  /** Optional body lines (ThemeText, centered) */
  paragraphs?: string[];
}

/**
 * Same hero shell and min-height as {@link HowItWorksScreen} (`pt-30 pb-15 min-h-[400px] lg:min-h-[80vh]`).
 */
export const BlogHero = ({
  badge,
  titleFirst,
  titleLast,
  lead,
  paragraphs = [],
}: BlogHeroProps) => {
  return (
    <Box
      component="header"
      className="relative flex items-center justify-center overflow-hidden pt-30 pb-15 min-h-[400px] lg:min-h-[80vh]"
      sx={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box className="relative z-10 flex flex-col items-center max-w-[900px] mx-auto text-center px-4">
        <LabelBadge label={badge} />
        <HeroHeading
          title={titleFirst}
          lastWord={titleLast}
          underlineUnderTitle
        />
        <Box className="max-w-[800px] mt-2 mb-8 flex flex-col gap-3 text-center w-full">
          <Typography
            className="text-sm lg:text-[17px] font-medium"
            sx={{ color: COLORS.secondary }}
          >
            {lead}
          </Typography>
          {paragraphs.map((text) => (
            <ThemeText key={text.slice(0, 48)} text={text} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
