export const ROUTES = {
  // Public routes
  landing: "/",
  howItWorks: "/how-it-works",
  faq: "/faq",
  aboutUs: "/about-us",
  privacyPolicy: "/privacy-policy",
  termsAndConditions: "/terms-and-conditions",
  customerSupport: "/customer-support",
  /** Blog index — list of posts (English, public) */
  blog: "/blog",

  // Auth routes
  login: "/auth/login",
  register: "/auth/register",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  resetPasswordSuccess: "/auth/reset-password-success",
  verification: "/auth/verification",
  verifyEmail: "/auth/verify-email",
  googleCallback: "/auth/google/callback",

  // Dashboard routes
  dashboard: "/dashboard",
  shop: "shop",
  photomone: "photomone",
  result: "result",
  profile: "profile",
  notifications: "notifications",
  market: "photomone/market",
  notice: "notice",
};

/** Single post: `/blog/post1`, `/blog/my-next-post`, etc. */
export const blogPostPath = (slug: string) => `${ROUTES.blog}/${slug}`;

export default ROUTES;
