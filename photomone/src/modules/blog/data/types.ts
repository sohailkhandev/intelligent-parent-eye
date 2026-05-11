/** Registry entry for a public blog post (English). */
export interface BlogPostMeta {
  slug: string;
  /** Small label above the hero title (e.g. Program, Update) */
  badge: string;
  heroTitleFirst: string;
  heroTitleLast: string;
  /** Primary line under the hero heading (secondary color) */
  heroLead: string;
  /** Optional extra lines below the lead (ThemeText) */
  heroParagraphs?: string[];
  pageTitle: string;
  pageDescription: string;
  jsonLdHeadline: string;
}
