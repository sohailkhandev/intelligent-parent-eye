// base url API Configuration
export const API_BASE_URL = "https://backend-staging.photomone.com/api/v1";
// export const API_BASE_URL = "https://backend.photomone.com/api/v1";

// Socket server base URL (same host as API, without /api/v1)
export const SOCKET_BASE_URL = "https://backend-staging.photomone.com";
// export const SOCKET_BASE_URL = "https://backend.photomone.com";

// Google OAuth Configuration
export const GOOGLE_CLIENT_ID =
  "360375140442-49jql94kdusg5341auifgatrhik4nptn.apps.googleusercontent.com";
// production client id test

// export const GOOGLE_CLIENT_ID =
//   "360375140442-vomqnp4ietcrjefv5l93g3dqkc27q8ai.apps.googleusercontent.com";

// Redirect URI must match exactly what's in Google Console
export const GOOGLE_REDIRECT_URI = `${API_BASE_URL}/auth/google`;

// API Endpoints
export const API_URLS = {
  // Auth
  login: "/auth/login",
  signup: "/auth/signup",
  logout: "/auth/logout",
  logoutOtherDevices: "/auth/reset-login-status",
  refreshToken: "/auth/refresh",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  resendVerificationEmail: "/auth/resend-verification-email",

  // Google Auth
  googleAuth: "/auth/google",
  googleLogin: "/auth/google/login",
  me: "/auth/me",
  changePassword: "/auth/change-password",

  // Profile
  profile: "/profile",
  profileLanguage: "/profile/language",
  profilePicture: "/profile/picture",
  deleteAccount: (userId: string) => `/auth/delete-account/${userId}`,

  // Slots
  slots: "/slots",
  updateSlot: (slotId: string) => `/slots/${slotId}`,
  revealPoints: (slotId: string) => `/slots/reveal-points/${slotId}`,
  claimPoints: (slotId: string) => `/slots/claim-earnings/${slotId}`,
  purchaseSlot: "/slots/purchase",
  uploadPhotoToSlot: (slotId: string) => `/slots/upload-photo/${slotId}`,
  /** POST with JSON body { slotId, images } - slotId in body, not in path */
  uploadPhoto: "/slots/upload-photo",
  generatePhotos: "/slots/generate-photos",
  fusedSlots: "/fused-slots",
  uploadImageToFusedSlot: (fusedSlotId: string) =>
    `/fused-slots/upload-image/${fusedSlotId}`,
  cancelUploadImageToFusedSlot: (fusedSlotId: string) =>
    `/fused-slots/cancel-upload-image/${fusedSlotId}`,
  selfFuse: "/fused-slots/self-fuse",
  fusionResults: "/fused-slots/fusion-results",

  // Markets
  markets: "/markets",
  purchaseMarket: "/markets/purchase",
  joinMarket: "/markets/join",
  mainMarket: "/markets/main",
  purchaseImage: "/markets/purchase-image",
  resultsHistory: "/markets/exposure-results",

  // Shop
  shopPackages: "/shop/packages",
  shopMyPackages: "/shop/my-packages",
  shopCheckout: "/shop/checkout",

  // Notifications
  notifications: "/notifications",
  markNotificationRead: (notificationId: string) =>
    `/notifications/read/${notificationId}`,

  // Notices
  notices: "/notices",

  // Ticket Packages
  myTickets: "/shop/my-tickets",

  // Purchased Images
  purchasedImages: "/markets/purchases",
  buyPurchasedImageSlot: "/markets/buy-purchased-image-slot",

  // Exposures
  exposures: "/exposures",

  // Gift Shop
  giftShop: "/gift-shop",
  giftShopMyPurchases: "/gift-shop/my-purchases",
  purchaseGiftCard: "/gift-shop/purchase",

  // Customer Support
  customerSupport: "/contact-support",

  /** Power Tester program — blog application (JSON: email, socialMediaUrl) */
  powerTesters: "/power-testers",

  // Chatbot (global)
  chatbot: "/chatbot",

  // Missions
  missions: "/missions",
  collectMission: (missionId: string) => `/missions/collect/${missionId}`,
};
