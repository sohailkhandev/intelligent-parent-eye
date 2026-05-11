/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URLS } from "@constants";
import { api } from "@utils";
import type { SlotsResponse, UploadPhotoParams, GeneratePhotosParams, UploadSelectedPhotoParams, PurchaseSlotParams, UploadImageToFusedSlotParams, SelfFuseParams, FusedSlotsResponse, FusionResultsResponse } from "@types";

export const getAllSlots = async (): Promise<SlotsResponse> => {
  try {
    const response = await api.get(API_URLS.slots);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch slots";
    throw new Error(errorMessage);
  }
};

/** Update slot (e.g. track view): PUT /slots/:slotId */
export const updateSlot = async (slotId: string) => {
  const response = await api.put(API_URLS.updateSlot(slotId), {});
  return response.data;
};

/** Reveal points for slot (spend 1 Locky): POST /slots/reveal-points/:slotId */
export const revealPoints = async (slotId: string) => {
  try {
    const response = await api.post(API_URLS.revealPoints(slotId));
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to reveal points";
    throw new Error(errorMessage);
  }
};

/** Claim points for slot (slot becomes unusable): POST /slots/claim-points/:slotId */
export const claimPoints = async (slotId: string) => {
  try {
    const response = await api.post(API_URLS.claimPoints(slotId));
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to claim points";
    throw new Error(errorMessage);
  }
};

export const purchaseSlot = async ({ quantity }: PurchaseSlotParams) => {
  const response = await api.post(API_URLS.purchaseSlot, { quantity });
  return response.data;
};

export const uploadPhotoToSlot = async ({ slotId, image, gender }: UploadPhotoParams) => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("gender", gender);

  const response = await api.post(API_URLS.uploadPhotoToSlot(slotId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/** Generate photos: POST /slots/generate-photos (no slotId), form-data: image, gender, ageGroup */
export const generatePhotos = async ({ image, gender, ageGroup }: GeneratePhotosParams) => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("gender", gender);
  formData.append("ageGroup", ageGroup);

  const response = await api.post(API_URLS.generatePhotos, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/** Upload selected generated photo: POST /slots/upload-photo with JSON body { slotId, images } */
export const uploadSelectedPhotoToSlot = async ({
  slotId,
  images,
}: UploadSelectedPhotoParams) => {
  const response = await api.post(API_URLS.uploadPhoto, { slotId, images });
  return response.data;
};

export const getFusedSlots = async (): Promise<FusedSlotsResponse> => {
  const response = await api.get(API_URLS.fusedSlots);
  return response.data;
};

/** Upload selected gallery image to a fused slot: POST /fused-slots/upload-image/:fusedSlotId, body { slotId } */
export const uploadImageToFusedSlot = async ({
  fusedSlotId,
  slotId,
}: UploadImageToFusedSlotParams) => {
  const response = await api.post(
    API_URLS.uploadImageToFusedSlot(fusedSlotId),
    { slotId }
  );
  return response.data;
};

/** Cancel uploaded image for a fused slot: POST /fused-slots/cancel-upload-image/:fusedSlotId */
export const cancelUploadImageToFusedSlot = async (fusedSlotId: string) => {
  const response = await api.post(API_URLS.cancelUploadImageToFusedSlot(fusedSlotId), {});
  return response.data;
};

/** Self-fuse: POST /fused-slots/self-fuse, body { slotIds: string[] } */
export const selfFuse = async ({ slotIds }: SelfFuseParams) => {
  const response = await api.post(API_URLS.selfFuse, { slotIds });
  return response.data;
};

/** Fusion results: GET /fused-slots/fusion-results?page=1&limit=10 */
export const getFusionResults = async (
  page = 1,
  limit = 10
): Promise<FusionResultsResponse> => {
  const response = await api.get(API_URLS.fusionResults, {
    params: { page, limit },
  });
  return response.data;
};

