// import {
//   ClaimStatus,
//   Community,
//   EBoardRole,
//   User,
//   Rating,
//   EReviewPros,
//   EReviewCons,
//   EReportSubType,
//   ReportStatus,
//   CommunityGuideline,
//   DocumentReference,
//   Timestamp,
//   GeoPoint,
// } from "./db.types";

// interface IClaim {
//   id: DocumentReference;

//   user?: User;
//   community?: Community;
//   documentUrl: string;
//   boardRole: EBoardRole;
//   note: string;
//   status: ClaimStatus;
//   statusHistory: ClaimStatus[];

//   createdAt: Timestamp;
//   updatedAt: Timestamp;
// }

// interface ISubscription {
//   id: string;
//   cancelAtPeriodEnd: boolean;
//   currentPeriodEnd: number;
//   currentPeriodStart: number;
//   interval: string;
//   intervalCount: number;
//   invoices: IInvoice[];
//   status: string;
// }

// interface IInvoice {
//   id: string;
//   amount: number | null;
//   createdAt: number;
//   currency: string;
//   status: string;
//   url: string;
// }

// interface IAssociationWithSubscription {
//   id: string;
//   about: string;
//   adImageUrl: string;
//   address: {
//     street1: string;
//     street2?: string;
//     city?: string;
//     state?: string;
//     zip?: string;
//   };
//   averageRating: number;
//   bannerUrl: string;
//   createdAt: string;
//   datatreeId: string;
//   email: string;
//   geoLocation: GeoPoint | null;
//   guidlines: CommunityGuideline[];
//   logoUrl: string;
//   managementCompanyId: string | null;
//   missionStatement: string;
//   name: string;
//   numberOfPosts: number;
//   numberOfReviews: number;
//   overallRating: number;
//   phone: string;
//   services: string;
//   subscription: ISubscription;
//   type: string;
//   updatedAt: string;
//   userId: string;
//   visionStatement: string;
// }

// interface ICommunitySubscription {
//   success: boolean;
//   associations: IAssociationWithSubscription[];
//   count: number;
// }

// interface IReview {
//   id: DocumentReference;

//   user: User;
//   community: Community;
//   rating: Rating;
//   pros?: EReviewPros[];
//   cons?: EReviewCons[];
//   comment: string;
//   reply: string;
//   repliedBy?: User;

//   createdAt: Timestamp;
//   updatedAt: Timestamp;
// }

// interface IReport {
//   id: DocumentReference;

//   type?: "review";
//   subType?: EReportSubType;
//   description?: string;
//   reportedRef?: IReview;
//   reportedBy?: User;
//   solvedBy?: string;
//   currentStatus?: ReportStatus;
//   statusHistory?: ReportStatus[];

//   createdAt?: Timestamp;
//   updatedAt?: Timestamp;
// }

// interface ICommunityReview {
//   id: DocumentReference;

//   community: Community;
//   rating: Rating;
//   pros?: EReviewPros[];
//   cons?: EReviewCons[];
//   comment: string;
//   reply: string;
//   repliedBy?: User;

//   createdAt: Timestamp;
//   updatedAt: Timestamp;
// }

// export type {
//   IClaim,
//   IReview,
//   ICommunityReview,
//   IReport,
//   ISubscription,
//   IInvoice,
//   IAssociationWithSubscription,
//   ICommunitySubscription,
// };
