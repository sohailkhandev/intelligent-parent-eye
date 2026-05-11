import { Box, Typography } from "@mui/material";
import wordUnderline from "@assets/images/wordUnderLine.png";

interface HeroHeadingProps {
  title: string | React.ReactNode;
  lastWord: string;
  className?: string;
  /** Min width for the underline (e.g. for short words to avoid blurry stretch). */
  underlineMinWidth?: number;
  /** When true, underline goes under the title (first part) instead of the last word. */
  underlineUnderTitle?: boolean;
}

export const HeroHeading = ({
  title,
  lastWord,
  className = "",
  underlineMinWidth,
  underlineUnderTitle = false,
}: HeroHeadingProps) => {
  const underlineBoxSx = {
    position: "relative" as const,
    display: "inline-block",
    ...(underlineMinWidth != null && { minWidth: underlineMinWidth }),
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "10px",
      backgroundImage: `url(${wordUnderline})`,
      backgroundSize: "100% 100%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
  };
  return (
    <Typography
      variant="h2"
      component="h2"
      className={`font-bold text-4xl lg:!text-6xl ${className}`}
    >
      {underlineUnderTitle ? (
        <>
          <Box component="span" sx={underlineBoxSx}>
            {title}
          </Box>
          &nbsp;{lastWord}
        </>
      ) : (
        <>
          {title}&nbsp;
          <Box component="span" sx={underlineBoxSx}>
            {lastWord}
          </Box>
        </>
      )}
    </Typography>
  );
};
