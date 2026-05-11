import type { ComponentType } from "react";
import type { BlogPostMeta } from "./types";
import { PowerTesterPost } from "../posts/PowerTesterPost";

/** Ordered list for the blog index (newest first when you add dates later). */
export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "post1",
    badge: "Discover & Earn",
    heroTitleFirst: "POWER",
    heroTitleLast: "TESTERS",
    heroLead: "Discover & Earn with AI-Generated Photos",
    heroParagraphs: [
      "Welcome to PhotoMone — the AI-powered photo trading platform.",
    ],
    pageTitle: "Power Tester Recruitment | PhotoMone Blog",
    pageDescription:
      "Discover & earn with AI-generated photos on PhotoMone. Power Tester program: 100 spots, TikTok or Instagram required, 1,000 Points reward. Redemption after May 15, credits, and how to apply.",
    jsonLdHeadline: "PhotoMone — Power Tester Recruitment",
  },
];

export function getBlogPostMeta(slug: string | undefined): BlogPostMeta | undefined {
  if (!slug) return undefined;
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/** Map slug → content component. Add new posts here. */
export const BLOG_POST_CONTENT: Record<string, ComponentType> = {
  post1: PowerTesterPost,
};
