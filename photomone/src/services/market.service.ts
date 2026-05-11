/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URLS } from "@constants";
import { api, getMarketEntryCount, translateMarketName } from "@utils";
import type {
  Market,
  MarketData,
  MarketsResponse,
  PurchaseMarketParams,
  JoinMarketParams,
  CreateExposuresParams,
  PurchaseImageParams,
  PurchaseImageResponse,
  MainMarketResponse,
  CompletedMarketsResponse,
  ExposureResultsResponse,
  ExposuresResponse,
} from "@types";

export const getAllMarkets = async (): Promise<MarketsResponse> => {
  const response = await api.get(API_URLS.markets);
  return response.data;
};

/** Transform API market to MarketData. entries null = free, 0 = locked, >0 = has entries. */
export const transformMarket = (
  market: Market,
  translations?: any
): MarketData => {
  const translatedName = translateMarketName(market.marketName, translations);
  return {
    id: `Market-${market.marketNumber}`,
    name: translatedName,
    label: translatedName,
    isFree: market.entries === null,
    entries: market.entries,
    entryCost: market.points,
    entryCount: getMarketEntryCount(market.marketNumber, market.entries),
    purchasePoints: market.purchasePoints,
    exposure: market.exposure ?? 0,
    inMarket: market.inMarket ?? false,
  };
};

export const purchaseMarket = async ({ marketNumber, ticketId }: PurchaseMarketParams) => {
  const payload: { marketNumber: number; ticketId?: string } = { marketNumber };
  if (ticketId) {
    payload.ticketId = ticketId;
  }
  const response = await api.post(API_URLS.purchaseMarket, payload);
  return response.data;
};

export const joinMarket = async ({ marketNumber }: JoinMarketParams) => {
  const response = await api.post(API_URLS.joinMarket, { marketNumber });
  return response.data;
};

export const createExposures = async ({
  marketNumber,
  slotId,
  exposures,
}: CreateExposuresParams) => {
  const response = await api.post(API_URLS.exposures, {
    marketNumber,
    slotId,
    exposures,
  });
  return response.data;
};

export const purchaseImage = async ({
  slotId,
}: PurchaseImageParams): Promise<PurchaseImageResponse> => {
  const response = await api.post(API_URLS.purchaseImage, { slotId });
  return response.data;
};

export const getMainMarket = async (): Promise<MainMarketResponse> => {
  const response = await api.get(API_URLS.mainMarket);
  return response.data;
};

export const getCompletedMarkets = async (): Promise<CompletedMarketsResponse> => {
  const response = await api.get(API_URLS.resultsHistory);
  return response.data;
};

export const getExposureResults = async (
  page = 1,
  limit = 10
): Promise<ExposureResultsResponse> => {
  const response = await api.get(API_URLS.resultsHistory, {
    params: { page, limit },
  });
  return response.data;
};

export const getExposures = async (): Promise<ExposuresResponse> => {
  const response = await api.get(API_URLS.exposures);
  return response.data;
};

