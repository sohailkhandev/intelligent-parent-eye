import { Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import type { FusedSlot, Slot } from "@types";
import { PhotomoneScreen } from "../screens";
import { MarketApis, SlotApis } from "@apis";
import { useAuthContext } from "@providers";
import { ROUTES } from "@constants";
import { Loading } from "@components";

export const PhotomoneContainer = () => {
  const { authUser, isLoading: authLoading } = useAuthContext();

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <Box className="flex items-center justify-center py-20">
        <Loading size={48} />
      </Box>
    );
  }

  // Redirect immediately if user is already in a market
  if (authUser?.inMarket === true) {
    return <Navigate to={`/dashboard/${ROUTES.market}`} replace />;
  }

  // Fetch all markets
  const { data: marketsData, isLoading: marketsLoading } =
    MarketApis.useGetAllMarkets();

  // Fetch all slots
  const { data: slotsData, isLoading: slotsLoading } =
    SlotApis.useGetAllSlots();

  // Fetch fused slots (Photo Fusion tab)
  const { data: fusedSlotsData, isLoading: fusedSlotsLoading } =
    SlotApis.useGetFusedSlots();

  // Get markets array from API response
  const markets = marketsData?.data?.markets ?? [];

  // Get slots array from API response
  const slots =
    slotsData?.data?.slots.filter((slot: Slot) => slot.imageUrl !== null) ?? [];

  // Get fused slots from API response (support both { data: { slots } } and { slots } shapes)
  const rawFused = fusedSlotsData?.data?.slots;
  const fallbackFused = (() => {
    const d = fusedSlotsData as unknown as { slots?: unknown[] };
    return Array.isArray(d?.slots) ? d.slots : [];
  })();
  const fusedSlots = (rawFused ?? fallbackFused) as FusedSlot[];
  const filledSlotsCount =
    fusedSlotsData?.data?.filledSlots ??
    (fusedSlotsData as unknown as { filledSlots?: number })?.filledSlots ??
    0;

  const isLoading = marketsLoading || slotsLoading;

  return (
    <PhotomoneScreen
      markets={markets}
      slots={slots}
      fusedSlots={fusedSlots}
      filledSlotsCount={filledSlotsCount}
      isLoading={isLoading}
      isFusedSlotsLoading={fusedSlotsLoading}
    />
  );
};

export default PhotomoneContainer;
