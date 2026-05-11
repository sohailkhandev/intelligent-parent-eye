import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { blogPostPath, ROUTES } from "@constants";
import { BlogHero } from "../components/BlogHero";
import { BlogBreadcrumb, blogHomeCrumb } from "../components/BlogBreadcrumb";
import {
  BLOG_POST_CONTENT,
  getBlogPostMeta,
} from "../data/postsRegistry";

function injectJsonLd(id: string, json: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json);
}

function removeJsonLd(id: string) {
  document.getElementById(id)?.remove();
}

export const BlogPostScreen = () => {
  const { slug } = useParams<{ slug: string }>();
  const meta = getBlogPostMeta(slug);
  const PostBody = slug ? BLOG_POST_CONTENT[slug] : undefined;

  useEffect(() => {
    if (!meta) return;

    const jsonId = "jsonld-blog-post";
    document.title = meta.pageTitle;

    let metaDesc = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = meta.pageDescription;

    const canonicalPath = `${window.location.origin}${blogPostPath(meta.slug)}`;
    let linkCanonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.rel = "canonical";
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalPath;

    const ogTags: { property: string; content: string }[] = [
      { property: "og:title", content: meta.pageTitle },
      { property: "og:description", content: meta.pageDescription },
      { property: "og:type", content: "article" },
      { property: "og:url", content: canonicalPath },
    ];
    ogTags.forEach(({ property, content }) => {
      let m = document.querySelector(`meta[property="${property}"]`);
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute("property", property);
        document.head.appendChild(m);
      }
      m.setAttribute("content", content);
    });

    injectJsonLd(jsonId, {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: meta.jsonLdHeadline,
      description: meta.pageDescription,
      author: {
        "@type": "Organization",
        name: "PhotoMone",
      },
      publisher: {
        "@type": "Organization",
        name: "PhotoMone",
      },
      inLanguage: "en",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalPath,
      },
    });

    return () => {
      document.title = "Photomone";
      removeJsonLd(jsonId);
    };
  }, [meta]);

  if (!meta || !PostBody) {
    return <Navigate to={ROUTES.blog} replace />;
  }

  return (
    <article
      className="w-full"
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      <meta itemProp="inLanguage" content="en" />
      <Typography
        component="h1"
        className="sr-only"
        itemProp="headline"
        sx={{ fontSize: "1px", margin: 0 }}
      >
        {meta.jsonLdHeadline}
      </Typography>

      <BlogHero
        badge={meta.badge}
        titleFirst={meta.heroTitleFirst}
        titleLast={meta.heroTitleLast}
        lead={meta.heroLead}
        paragraphs={meta.heroParagraphs}
      />

      <BlogBreadcrumb
        items={[
          { label: "Home", to: ROUTES.landing },
          blogHomeCrumb,
          { label: meta.jsonLdHeadline },
        ]}
      />

      <Box className="pt-10 md:pt-14 lg:pt-16">
        <PostBody />
      </Box>
    </article>
  );
};

export default BlogPostScreen;
