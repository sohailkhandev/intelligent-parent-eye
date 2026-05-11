import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { COLORS, blogPostPath, ROUTES } from "@constants";
import { BlogHero } from "../components/BlogHero";
import { BlogBreadcrumb } from "../components/BlogBreadcrumb";
import { BLOG_POSTS } from "../data/postsRegistry";

const PAGE_TITLE = "Blog — News & updates | PhotoMone";
const PAGE_DESCRIPTION =
  "Official PhotoMone blog: product updates, community programs, and marketplace news.";

export const BlogIndexScreen = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    let metaDesc = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = PAGE_DESCRIPTION;

    const canonicalPath = `${window.location.origin}${ROUTES.blog}`;
    let linkCanonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.rel = "canonical";
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalPath;

    return () => {
      document.title = "Photomone";
    };
  }, []);

  return (
    <Box component="div" className="w-full">
      <BlogHero
        badge="Blog"
        titleFirst="PHOTOMONE"
        titleLast="BLOG"
        lead="News and product updates"
        paragraphs={[
          "Stay informed about new features, community programs, and marketplace releases.",
        ]}
      />

      <BlogBreadcrumb
        items={[{ label: "Home", to: ROUTES.landing }, { label: "Blog" }]}
      />

      <Box
        component="section"
        className="w-full px-4 md:px-8 lg:px-12 pb-12 md:pb-16 pt-10 md:pt-14 lg:pt-16"
      >
        <Box
          className="max-w-[1100px] mx-auto"
          sx={{ color: COLORS.generalText }}
        >
          <Typography
            component="h2"
            variant="h3"
            className="!font-bold !text-lg md:!text-xl mb-4 md:mb-6 lg:mb-8"
          >
            Latest posts
          </Typography>

          <Box className="grid gap-4 sm:grid-cols-2 lg:gap-6 lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                to={blogPostPath(post.slug)}
                className="group block rounded-xl border p-4 md:p-5 transition-shadow hover:shadow-md"
                style={{
                  borderColor: `${COLORS.primary}55`,
                  background: `linear-gradient(145deg, ${COLORS.white}, ${COLORS.primary}08)`,
                }}
              >
                <Typography
                  component="span"
                  className="text-xs font-semibold uppercase tracking-wider mb-2 inline-block"
                  sx={{ color: COLORS.primary }}
                >
                  {post.badge}
                </Typography>
                <Typography
                  component="h3"
                  className="font-montserrat font-bold text-base md:text-lg mb-1.5 group-hover:underline leading-snug"
                  sx={{ color: COLORS.generalText }}
                >
                  {post.jsonLdHeadline}
                </Typography>
                <Typography
                  className="text-sm line-clamp-2 leading-snug"
                  sx={{ color: COLORS.textDark }}
                >
                  {post.pageDescription}
                </Typography>
                <Typography
                  className="text-sm font-medium mt-3 inline-flex items-center gap-1"
                  sx={{ color: COLORS.primary }}
                >
                  Read article
                  <span aria-hidden>→</span>
                </Typography>
              </Link>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BlogIndexScreen;
