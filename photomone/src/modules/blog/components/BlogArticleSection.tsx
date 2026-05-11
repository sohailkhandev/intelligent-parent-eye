import { Box } from "@mui/material";
import { COLORS } from "@constants";
import blueEllipse from "@assets/images/blueEllipse.png";
import pinkEllipse from "@assets/images/pinkEllipse.png";

type EllipseSide = "left" | "right" | "none";

interface BlogArticleSectionProps {
  children: React.ReactNode;
  /** Decorative ellipse like About Us content sections */
  withEllipse?: EllipseSide;
  className?: string;
  /** Set true on the last block to avoid a trailing rule line */
  hideBorder?: boolean;
}

/**
 * Content band matching About Us: max width 1280px, horizontal padding, bottom border.
 */
export const BlogArticleSection = ({
  children,
  withEllipse = "none",
  className = "",
  hideBorder = false,
}: BlogArticleSectionProps) => {
  return (
    <Box
      component="section"
      className={`relative w-full px-4 md:px-8 ${className}`}
    >
      {withEllipse === "left" && (
        <Box
          component="img"
          src={blueEllipse}
          alt=""
          aria-hidden
          className="absolute z-0 left-0 top-1/2 -translate-y-[30%] h-full object-contain pointer-events-none"
        />
      )}
      {withEllipse === "right" && (
        <Box
          component="img"
          src={pinkEllipse}
          alt=""
          aria-hidden
          className="absolute z-0 right-0 top-0 h-full object-contain pointer-events-none"
        />
      )}
      <Box
        className="max-w-[1280px] mx-auto flex flex-col text-left py-10 md:py-16 relative z-10"
        sx={{
          color: COLORS.generalText,
          ...(hideBorder
            ? {}
            : { borderBottom: `1px solid ${COLORS.grayLight}` }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
