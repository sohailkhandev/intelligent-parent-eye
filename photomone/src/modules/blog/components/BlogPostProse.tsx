import { Box } from "@mui/material";

type BlogPostProseProps = {
  children: React.ReactNode;
  className?: string;
  /** Wider outer shell on large screens (paired with sidebar layouts). */
  wide?: boolean;
};

/**
 * Centered reading column. Use `wide` when inside a split desktop layout so the
 * inner column can grow with the grid.
 */
export const BlogPostProse = ({
  children,
  className = "",
  wide = false,
}: BlogPostProseProps) => {
  return (
    <Box
      component="div"
      className={`w-full mx-auto px-4 sm:px-6 ${wide ? "max-w-none" : "max-w-[42rem]"} ${className}`}
    >
      {children}
    </Box>
  );
};
