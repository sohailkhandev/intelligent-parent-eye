/** User entry in socket market event (usersData / users) */
export interface MarketEventUser {
  _id?: string;
  userId?: string;
  slotId?: string;
  imageUrl?: string;
  isSold?: boolean;
}

/** Exposure result payload in photoSold / photoUnsold events */
export interface MarketEventExposureResult {
  marketNumber?: number;
  buyerId?: string;
  /** Sold photo image URL on the result */
  imageUrl?: string;
  users?: MarketEventUser[];
  usersData?: MarketEventUser[];
  _id?: string;
  purchasePoints?: number;
  earnedPoints?: number;
  marketName?: string;
}

/** Payload for socket events photoSold and photoUnsold */
export interface MarketEventPayload {
  marketNumber: number;
  message: string;
  marketName?: string;
  /** Top-level image URL (e.g. sold/unsold photo) when backend sends it here */
  imageUrl?: string;
  /** Market points (from backend) */
  marketPoints?: number;
  /** Earned points at top level */
  earnedPoints?: number;
  purchasePoints?: number;
  exposureResult?: MarketEventExposureResult;
}

export interface ExposureBatchResult {
  marketNumber?: number;
  buyerId?: string;
  usersData?: MarketEventUser[];
}

export interface ExposureBatchEndedPayload {
  message: string;
  marketNumber: number;
  marketName?: string;
  exposure?: number;
  exposures?: number;
  photoLicensesSold?: number;
  photoLicenseSold?: number;
  totalPoints?: number;
  totalScoreEarned?: number;
  exposureResults: ExposureBatchResult[];
}

/** Payload for socket event `slotShareReceived` */
export interface SlotShareReceivedPayload {
  shareSlotId: string;
  slotId: string;
  imageUrl: string;
  score: number;
  senderId: string;
}
