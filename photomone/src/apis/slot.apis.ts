import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SlotService } from "@services";

export const useGetAllSlots = () =>
  useQuery({
    queryKey: ["slots"],
    queryFn: SlotService.getAllSlots,
    refetchOnMount: "always",
    staleTime: 0,
  });

export const useUpdateSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotId: string) => SlotService.updateSlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const useRevealPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotId: string) => SlotService.revealPoints(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const useClaimPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotId: string) => SlotService.claimPoints(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
};

export const usePurchaseSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: SlotService.purchaseSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const useUploadPhotoToSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: SlotService.uploadPhotoToSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const useGeneratePhotos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: SlotService.generatePhotos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const useUploadSelectedPhotoToSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: SlotService.uploadSelectedPhotoToSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const useGetFusedSlots = () =>
  useQuery({
    queryKey: ["fusedSlots"],
    queryFn: SlotService.getFusedSlots,
    refetchOnMount: "always",
    staleTime: 0,
  });

export const useUploadImageToFusedSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: SlotService.uploadImageToFusedSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fusedSlots"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const useCancelUploadImageToFusedSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: SlotService.cancelUploadImageToFusedSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fusedSlots"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const useSelfFuse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: SlotService.selfFuse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fusedSlots"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["fusionResults"] });
    },
  });
};

const DEFAULT_FUSION_PAGE = 1;
const DEFAULT_FUSION_LIMIT = 10;

export const useGetFusionResults = (
  page = DEFAULT_FUSION_PAGE,
  limit = DEFAULT_FUSION_LIMIT
) =>
  useQuery({
    queryKey: ["fusionResults", page, limit],
    queryFn: () => SlotService.getFusionResults(page, limit),
  });
