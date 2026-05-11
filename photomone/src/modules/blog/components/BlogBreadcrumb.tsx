import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { COLORS, ROUTES } from "@constants";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BlogBreadcrumbProps {
  items: BreadcrumbItem[];
}

export const BlogBreadcrumb = ({ items }: BlogBreadcrumbProps) => {
  return (
    <Box
      component="nav"
      aria-label="Breadcrumb"
      className="w-full px-4 md:px-8 py-2.5"
    >
      <Box className="max-w-[1280px] mx-auto">
        <ol className="flex flex-wrap items-center gap-1 text-sm">
          {items.map((item, i) => (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && (
                <span className="text-[#758599]" aria-hidden>
                  /
                </span>
              )}
              {item.to ? (
                <Link
                  to={item.to}
                  className="no-underline hover:no-underline"
                  style={{ color: COLORS.primary }}
                >
                  {item.label}
                </Link>
              ) : (
                <Typography
                  component="span"
                  className="font-medium truncate max-w-[min(100vw-8rem,28rem)]"
                  sx={{ color: COLORS.generalText }}
                >
                  {item.label}
                </Typography>
              )}
            </li>
          ))}
        </ol>
      </Box>
    </Box>
  );
};

export const blogHomeCrumb = { label: "Blog", to: ROUTES.blog };
