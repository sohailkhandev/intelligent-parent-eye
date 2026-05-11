// PhotoMone API Response Types

// Base API Response
export interface ApiResponse<T> {
  status: "success" | "fail" | "error";
  message?: string;
  data?: T;
}

// User Type (from /auth/me response)
export interface User {
  _id: string;
  fullName: string;
  role: UserRole;
  email: string;
  profilePicture?: string | null;
  profileCompleted: boolean;
  gender?: Gender | null;
  preferredGender?: PreferredGender | null;
  ageGroup?: string | null;
  introduction?: string | null;
  country?: string | null;
  points: number;
  /** Dollar amount from API (display with $); do not derive from points in the client */
  earnings?: number;
  locky?: number;
  lastLogin?: string | null;
  isActive: boolean;
  inMarket?: boolean;
  createdAt: string;
  updatedAt: string;
  isGoogleSignup: boolean;
  /** When backend marks session as replaced by another device */
  isLoggedIn?: boolean;
}

// User Role Enum
export type UserRole = "user" | "admin";

// Gender Enum
export type Gender = "male" | "female" | "other";

// Preferred Gender Enum
export type PreferredGender = "male" | "female" | "both";

// Auth Response Types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginResponse extends ApiResponse<AuthResponse> {}
export interface SignupResponse extends ApiResponse<AuthResponse> {}
export interface MeResponse extends ApiResponse<User> {}

// Shop Package Types
export interface ShopPackage {
  packType: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  points: number;
  bonus: number;
  total: number;
}

export interface ShopPackagesResponse extends ApiResponse<ShopPackage[]> {}

// Shop Checkout Types
export interface ShopCheckoutParams {
  packType: string;
}

export interface ShopCheckoutData {
  sessionId: string;
  url: string;
}

export interface ShopCheckoutResponse extends ApiResponse<ShopCheckoutData> {}

// My Packages (purchase history) - GET /shop/my-packages
export interface PackagePurchase {
  _id: string;
  packType: string;
  packageName: string;
  price: number;
  points: number;
  bonus: number;
  total: number;
  createdAt: string;
}

export interface MyPackagesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MyPackagesData {
  pagination: MyPackagesPagination;
  data: PackagePurchase[];
}

export interface MyPackagesResponse extends ApiResponse<MyPackagesData> {}

// Notification Types
export interface Notification {
  _id: string;
  userId: string;
  type: string;
  heading: string;
  description: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsData {
  notifications: Notification[];
  unreadCount: number;
}

export interface NotificationsResponse extends ApiResponse<NotificationsData> {}

// Notice Types (GET /notices)
export interface Notice {
  _id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  isPinned: boolean;
  isPopup: boolean;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
}

export interface NoticesResponse extends ApiResponse<Notice[]> {}

// Ticket Package Types
export interface TicketPackage {
  _id: string;
  userId: string;
  ticketName: string;
  price: number;
  points: number;
  bonus: number;
  total: number;
  isUsed: boolean;
  createdAt: string;
  updatedAt: string;
  /** Entries granted by this ticket (from API, per market when fetched with marketNumber). */
  entries: number;
}

export interface TicketPackagesResponse extends ApiResponse<TicketPackage[]> {}

// Purchased Image Types
export interface Seller {
  _id: string;
  fullName: string;
  email: string;
  profilePicture: string | null;
}

export interface PurchasedImage {
  _id: string;
  index: number;
  filled: boolean;
  imageUrl: string | null;
  expirationTime: string | null;
  replacedAt: string | null;
  seller: Seller | null;
  marketName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PurchasedImagesData {
  purchases: PurchasedImage[];
}

export interface PurchasedImagesResponse extends ApiResponse<PurchasedImagesData> {}

// Buy Purchased Image Slot Types
export interface BuyPurchasedImageSlotParams {
  quantity: number;
}

export interface BuyPurchasedImageSlotResponse extends ApiResponse<void> {}

// Purchase Image (markets/purchase-image) response
export interface PurchaseImageResponseData {
  message?: string;
  purchasedImage?: unknown;
  remainingPoints?: number;
  exposureAmount?: number;
}

export interface PurchaseImageResponse extends ApiResponse<PurchaseImageResponseData> {}

// Gift Shop Types
export interface GiftShopItem {
  id: string;
  name: string;
  price: number;
  points: number;
  companyCost: number;
  totalPoints: number;
  canPurchase: boolean;
  logo?: string;
}

export interface GiftShopResponse extends ApiResponse<GiftShopItem[]> {}

// Purchase Gift Card Types
export interface PurchaseGiftCardParams {
  giftId: string;
}

export interface PurchaseGiftCardResponse extends ApiResponse<void> {}

// Gift Card Purchase History - GET /gift-shop/my-purchases
export type GiftCardPurchaseStatus = "pending" | "given" | "declined";

export interface GiftCardPurchase {
  _id: string;
  giftName: string;
  giftPrice: number;
  totalPoints: number;
  status: GiftCardPurchaseStatus;
  createdAt: string;
}

export interface GiftCardPurchasesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GiftCardPurchasesData {
  pagination: GiftCardPurchasesPagination;
  data: GiftCardPurchase[];
}

export interface GiftCardPurchasesResponse extends ApiResponse<GiftCardPurchasesData> {}

export interface MarketData {
  id: string;
  name: string;
  label: string;
  isFree: boolean;
  entries: number | null;
  entryCost?: number;
  entryCount?: number;
  purchasePoints?: number;
  exposure?: number;
  inMarket?: boolean;
}

export interface CreateExposuresResponse extends ApiResponse<unknown> {}

/** Missions — GET /missions */
export type MissionStatus = "incompleted" | "completed" | "collected";

export interface Mission {
  _id: string;
  userId: string;
  missionName: string;
  description: string;
  url: string;
  status: MissionStatus;
  points: number;
  entries?: number;
  marketNumber?: number;
  marketName?: string;
}

export interface MissionsListData {
  missions: Mission[];
}

export interface MissionsListResponse extends ApiResponse<MissionsListData> {}

/** Socket `missionCompleted` payload (may omit `_id` depending on server) */
export interface MissionCompletedSocketPayload {
  missionName: string;
  description: string;
  url: string;
  status: string;
  points: number;
  missionId?: string;
  _id?: string;
}
