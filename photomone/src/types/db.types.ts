// /**** Author: Iqbal Shehzada ****/

// /**** Common Considerations and Best Practices ****/

// // - Make sure collection names are in lower cases.
// // - Make sure collection names are plurals.
// // - Make sure every document has a field called createdAt(Timestamp) which represents the date at which the document was created.
// // - Make sure to use camel casing on all keys inside the documents.
// // - If the developers have any doubts/suggestions about the schema, they should contact the person who created the schema, to modify the schema.

// Slot Types (get all slots response includes full slot details)
export interface Slot {
  _id: string;
  ownerId: string;
  slotNumber: number;
  category: string | null;
  expirationTime: string | null;
  genre: string | null;
  imageUrl: string | null;
  uploadedAt: string | null;
  type: string;
  isNew: boolean;
  isPetrified: boolean;
  score: number;
  progress: number | null;
  rankValue: number | null;
  rankLabel: string | null;
  totalPoints: number | null;
  totalSales: number;
  totalExposures: number;
  styles: SlotDetailsStyles | null;
  rankStyles: { bgUrl: string; frameUrl: string; ribbonUrl: string } | null;
  __v: number;
  createdAt?: string;
  updatedAt: string;
}

export interface SlotsData {
  totalSlots: number;
  filledSlots: number;
  unfilledSlots: number;
  slots: Slot[];
}

export interface SlotsResponse {
  status: string;
  data: SlotsData;
}

// Fused slots (Photo Fusion tab)
export interface FusedSlot {
  _id: string;
  ownerId: string;
  slotNumber: number;
  name: string;
  isDisabled?: boolean;
  vault_state: string | null;
  lock_type: string | null;
  fusion_origin: string | null;
  imageUrl: string | null;
  slotId: string | null;
  uploadedAt: string | null;
  type: string;
  isNew: boolean;
  isPetrified: boolean;
  score: number;
  progress: number | null;
  rankValue: number | null;
  rankLabel: string | null;
  totalPoints: number | null;
  totalSales: number;
  totalExposures: number;
  styles: unknown | null;
  rankStyles: unknown | null;
  __v: number;
  updatedAt: string;
}

export interface FusedSlotsData {
  totalSlots: number;
  filledSlots: number;
  slots: FusedSlot[];
}

export interface FusedSlotsResponse {
  status: string;
  data: FusedSlotsData;
}

export interface UploadPhotoParams {
  slotId: string;
  image: File;
  gender: string;
}

export interface GeneratePhotosParams {
  image: File;
  gender: string;
  ageGroup: string;
}

export interface GeneratedImageItem {
  imageUrl: string;
  s3Key: string;
  status: string;
}

export interface UploadSelectedPhotoParams {
  slotId: string;
  images: GeneratedImageItem[];
}

export interface PurchaseSlotParams {
  quantity: number;
}

export interface UploadImageToFusedSlotParams {
  fusedSlotId: string;
  slotId: string;
}

export interface SelfFuseParams {
  slotIds: string[];
}

// Slot Details Types
export interface SlotDetailsSellingRate {
  label: string;
  min: number;
  max: number;
}

export interface SlotDetailsStyles {
  color: string;
  width: string;
  effect: string;
}

export interface SlotDetailsData {
  imageUrl: string;
  score: number;
  totalPoints?: number;
  progress?: number;
  rankValue?: number;
  rankLabel?: string;
  slotId?: string;
  ownerName?: string;
  styles?: SlotDetailsStyles | null;
  rankStyles?: {
    bgUrl: string;
    frameUrl: string;
    ribbonUrl: string;
  } | null;
}

export interface SlotDetailsResponse {
  status: string;
  data: SlotDetailsData;
}

// Market Types
export interface Market {
  marketNumber: number;
  marketName: string;
  entries: number | null;
  points: number;
  purchasePoints?: number;
  exposure?: number;
  inMarket?: boolean;
}

export interface MarketsData {
  markets: Market[];
}

export interface MarketsResponse {
  status: string;
  data: MarketsData;
}

export interface PurchaseMarketParams {
  marketNumber: number;
  ticketId?: string;
}

export interface JoinMarketParams {
  marketNumber: number;
}

export interface CreateExposuresParams {
  marketNumber: number;
  slotId: string;
  exposures: number;
}

export interface PurchaseImageParams {
  slotId: string;
}

export interface OtherSellerDetail {
  imageUrl: string;
  userId: string;
  slotId?: string;
  imageId?: {
    _id: string;
  };
  isAutomateduser: boolean;
}

export interface MainMarket {
  _id: string;
  marketNumber: number;
  marketName: string;
  purchasePoints: number;
  status: string;
  category: string | null;
  totalSellers: number;
  otherSellers: string[];
  otherSellerDetails: OtherSellerDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface MainMarketData {
  market: MainMarket;
}

export interface MainMarketResponse {
  status: string;
  data: MainMarketData;
}

// Completed Market Types
export interface ExposureUser {
  userId: string;
  fullName: string;
  imageUrl: string;
  isSold: boolean;
}

export interface Exposure {
  users: ExposureUser[];
}

export interface SuccessfulSeller {
  buyerId: string;
  sellerId: string;
}

export interface CompletedMarket {
  _id: string;
  marketNumber: number;
  marketName: string;
  userImageUrl: string;
  status: string;
  category: string | null;
  totalSellers: number;
  purchasePoints: number;
  sales: number;
  exposures: Exposure[];
  successfulSellers: SuccessfulSeller[];
  createdAt: string;
  updatedAt: string;
}

export interface CompletedMarketsData {
  markets: CompletedMarket[];
}

export interface CompletedMarketsResponse {
  status: string;
  data: CompletedMarketsData;
}

// Exposure Result Types (New API Structure)
export interface ExposureResultUser {
  _id: string;
  fullName: string;
  email: string;
  profilePicture: string;
  imageUrl: string;
  isSold: boolean;
}

export interface ExposureResult {
  _id: string;
  marketName: string;
  purchasePoints: number;
  imageUrl: string;
  isSold: boolean;
  users: ExposureResultUser[];
  createdAt: string;
  updatedAt: string;
}

export interface ExposureResultsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ExposureResultsCounts {
  exposures: number;
  totalSales: number;
  sellingRate: number;
  earnings: number;
}

export interface ExposureResultsData {
  pagination: ExposureResultsPagination;
  counts: ExposureResultsCounts;
  exposureResults: ExposureResult[];
}

export interface ExposureResultsResponse {
  status: string;
  data: ExposureResultsData;
}

// Fusion Results API Types (Fusion tab)
export interface FusionSlotImage {
  slotId: string;
  imageUrl: string;
}

export interface FusionResult {
  _id: string;
  imageUrl: string;
  ownerId: string;
  slotsImages: FusionSlotImage[];
  resultSlotId?: string;
  score: number;
  points: number | null;
  pointVisibility: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FusionResultsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FusionResultsData {
  pagination: FusionResultsPagination;
  results: FusionResult[];
}

export interface FusionResultsResponse {
  status: string;
  data: FusionResultsData;
}

// Exposures API Types (for ExposuresTableDialog)
export interface Exposure {
  _id: string;
  slotId: string;
  exposures: number;
  marketNumber: number;
  userId: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ExposuresData {
  exposures: Exposure[];
}

export interface ExposuresResponse {
  status: string;
  data: Exposure[];
}

// // Placeholder types for Firebase - replace with actual Firebase types when firebase is installed
// type DocumentReference = string;
// type Timestamp = Date | string;
// type GeoPoint = { latitude: number; longitude: number };

// interface User {
//   id: DocumentReference;

//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   avatarUrl: string;
//   address: Partial<Address>;
//   isAddressVerified: boolean;
//   ownershipType: EOwnershipType;
//   ownershipName: string;
//   isPropertyManagedByHOA: boolean;
//   propertyHoaName: string;
//   isPropertyHoaVerified: boolean;
//   appearWithNickname: boolean;
//   nickname: string;
//   isDeleted: boolean;
//   deletedAt?: Timestamp;
//   notificationSettings: UserNotificationSettings;
//   roles: EUserRole[];
//   stripeCustomerId: string;
//   subscription: ESubscription;

//   createdAt: Timestamp;
//   updatedAt: Timestamp;
// }

// interface Admin {
//   id: DocumentReference;

//   firstName: string;
//   lastName: string;
//   email: string;
//   role: EAdminRole;
//   permissions: EAdminPermission[];
//   lastLogin?: Timestamp;

//   createdAt: Timestamp;
//   updatedAt: Timestamp;
// }

// interface Community {
//   id?: DocumentReference;
//   datatreeId?: string | number;

//   type?: ECommunityType;
//   name?: string;
//   email?: string;
//   phone?: string;
//   logoUrl?: string;
//   bannerUrl?: string;
//   numberOfReviews?: number;
//   numberOfPosts?: number;
//   averageRating?: number;
//   address?: Partial<Address>;
//   geoLocation?: GeoPoint;
//   managementCompanyId?: DocumentReference;
//   about?: string;
//   adImageUrl: string;
//   missionStatement: string;
//   visionStatement: string;
//   services?: string;
//   guidlines?: Partial<CommunityGuideline>[];
//   userId?: DocumentReference;

//   createdAt?: Timestamp;
//   updatedAt?: Timestamp;
// }

// interface Review {
//   id: DocumentReference;

//   communityId: DocumentReference;
//   userId: DocumentReference;
//   rating: Rating;
//   pros?: EReviewPros[];
//   cons?: EReviewCons[];
//   comment: string;
//   reply: string;
//   repliedById?: DocumentReference;
//   isActive: boolean;
//   isDeleted?: boolean;

//   createdAt: Timestamp;
//   updatedAt: Timestamp;
// }

// interface Report {
//   id: DocumentReference;

//   type: "review";
//   subType: EReportSubType;
//   description: string;
//   reportedRef: DocumentReference;
//   reportedBy: DocumentReference;
//   currentStatus: ReportStatus;
//   statusHistory: ReportStatus[];
//   solvedBy?: string;

//   createdAt: Timestamp;
//   updatedAt: Timestamp;
// }

// interface Claim {
//   id: DocumentReference;

//   userId: DocumentReference;
//   communityId: DocumentReference;
//   documentUrl: string;
//   boardRole: EBoardRole;
//   note: string;
//   status: ClaimStatus;
//   statusHistory: ClaimStatus[];

//   createdAt: Timestamp;
//   updatedAt: Timestamp;
// }

// interface Notification {
//   id: DocumentReference;

//   userId: DocumentReference;
//   docRef: DocumentReference;
//   title: string;
//   message: string;
//   isRead: boolean;
//   createdAt: Timestamp;
// }

// // Types
// interface ClaimStatus {
//   status: EClaimStatus;
//   date: Timestamp;
// }

// interface Address {
//   street1: string;
//   street2: string;
//   city: string;
//   state: string;
//   zip: string;
// }

// interface Rating {
//   overall: number;
//   governance: number;
//   financial: number;
//   maintenance: number;
//   responsiveness: number;
// }

// interface CommunityGuideline {
//   title: EGuidelineTitle;
//   description: string;
//   documentUrl: string;
//   availableForHomeowners: boolean;
// }

// interface UserNotificationSettings {
//   email: boolean;
//   inApp: boolean;
//   sms: boolean;
// }

// interface ReportStatus {
//   status: EReportStatus;
//   date: Timestamp;
// }

// // Enums
// enum EReportSubType {
//   HATEFUL_CONDUCT_LANGUAGE = "Hateful Conduct/Language",
//   THREATENING_VIOLENCE = "Threatening Violence",
//   SHARING_PERSONAL_INFORMATION_DOXING = "Sharing Personal Information/Doxing",
//   HARASSMENT_BULLYING = "Harassment/Bullying",
//   MINOR_ABUSE_SEXUALIZATION = "Minor Abuse/Sexualization",
//   SEXUALLY_EXPLICIT_MATERIAL_NUDITY = "Sexually Explicit Material/Nudity",
//   SELF_HARM_SUICIDE_GLORIFICATION = "Self Harm/Suicide Glorification",
//   COPYRIGHT_VIOLATION_IP_INFRINGEMENT = "Copyright Violation/IP Infringement",
//   DRUGS_WEAPONS = "Drugs/Weapons",
//   OTHER = "Other",
// }

// enum EReportStatus {
//   UNSOLLVED = "Unsolved",
//   ARCHIVED = "Archived",
// }

// enum EOwnershipType {
//   LLC_OR_COMPANY_OWNED = "LLC or Company-Owned",
//   INDIVIDUAL_OWNED = "Individual/Personal Ownership",
//   HELD_IN_TRUST = "Held in Trust or Estate",
// }

// enum ECommunityType {
//   HOA = "HOA",
//   COA = "COA",
//   MANAGEMENT_COMPANY = "Management Company",
// }

// enum EGuidelineTitle {
//   RULES_AND_REGULATIONS = "Rules and Regulations",
//   CCRS = "CC&Rs",
//   BYLAWS = "Bylaws",
//   FEDERAL_AND_STATE_LAWS = "Federal and State Laws",
//   ARTICLES_OF_INCORPORATION = "Articles of Incorporation",
// }

// enum EReviewPros {
//   TRANSPARENCY = "Transparency",
//   MAINTENANCE_PLANNING = "Maintenance Planning",
//   EFFECTIVE_COMMUNICATION = "Effective Communication",
//   FINANCIAL_PLANNING = "Financial Planning",
//   AMENITY_UPKEEP = "Amenity Upkeep",
//   CUSTOMER_SERVICE = "Customer Service",
//   RECEPTIVE = "Receptive",
//   FIAR_FEES = "Fair Fees",
// }

// enum EReviewCons {
//   FEE_INCREASES = "Fee Increases",
//   INCONSISTENT_ENFORCEMENT = "Inconsistent Enforcement",
//   NEGLECTED_MAINTENANCE = "Neglected Maintenance",
//   LACK_OF_TRANSPARENCY = "Lack of Transparency",
//   FINANCIAL_ISSUES = "Financial Issues",
//   POOR_COMMUNICATION = "Poor Communication",
//   LOW_RESERVES = "Low Reserves",
//   LEGAL_DISPUTES = "Legal Disputes",
// }

// enum EBoardRole {
//   PRESIDENT = "President",
//   VICE_PRESIDENT = "Vice President",
//   SECRETARY = "Secretary",
//   TREASURER = "Treasurer",
// }

// enum EAdminRole {
//   ADMIN = "Admin",
//   SUPER_ADMIN = "Super Admin",
// }

// enum EAdminPermission {
//   USERS = "Users",
//   REVIEWS = "Reviews",
//   REPORTS = "Reports",
//   CLAIMS = "Claims",
//   SUBSCRIPTIONS = "Subscriptions",
// }

// enum EUserRole {
//   USER = "User",
//   ASSOCIATION_ADMIN = "HOA Admin",
// }

// enum EClaimStatus {
//   PENDING = "Pending",
//   APPROVED = "Approved",
//   REJECTED = "Rejected",
// }

// enum ESubscription {
//   BASIC = "Basic",
//   PREMIUM = "Premium",
// }

// export type {
//   Community,
//   User,
//   Review,
//   Report,
//   Claim,
//   Admin,
//   Address,
//   Notification,
//   ClaimStatus,
//   Rating,
//   ReportStatus,
//   CommunityGuideline,
//   DocumentReference,
//   Timestamp,
//   GeoPoint,
// };
// export {
//   EAdminRole,
//   EAdminPermission,
//   EReportStatus,
//   ECommunityType,
//   EBoardRole,
//   EClaimStatus,
//   EReviewPros,
//   EReviewCons,
//   EReportSubType,
// };
