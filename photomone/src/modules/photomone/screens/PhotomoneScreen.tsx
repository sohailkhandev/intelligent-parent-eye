import { Box, Typography, Dialog, DialogContent } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState, useEffect, useCallback } from "react";

import {
  MainDialog,
  Loading,
  TabBar,
  DashboardHeading,
  MainButton,
} from "@components";
import {
  JoinMarketDialog,
  MarketCard,
  SellPhotoForm,
  TicketPackagesDialog,
  PhotoFusionContent,
  SelectPhotoForFusedSlotForm,
} from "../components";
import { MonetizationIcon, PhotoFusionIcon } from "@assets/icons/svg";
import { COLORS } from "@constants";
import type { Market, Slot, MarketData, FusedSlot } from "@types";
import { MarketService } from "@services";
import { useAuthContext, useLanguage } from "@providers";
import { playSellSuccessChime, getFusedSlotBadgeLabel } from "@utils";

interface PhotomoneScreenProps {
  markets: Market[];
  slots: Slot[];
  fusedSlots?: FusedSlot[];
  filledSlotsCount?: number;
  isLoading?: boolean;
  isFusedSlotsLoading?: boolean;
}

export const PhotomoneScreen = ({
  markets,
  slots,
  fusedSlots = [],
  filledSlotsCount = 0,
  isLoading = false,
  isFusedSlotsLoading = false,
}: PhotomoneScreenProps) => {
  const { authUser } = useAuthContext();
  const { translations } = useLanguage();
  const t = translations || {};
  const photomone = t?.photomone || {};
  const sellPhoto = photomone?.sellPhoto || {};
  const ticketPackages = photomone?.ticketPackages || {};
  const photoFusion = photomone?.photoFusion || {};

  const [activeTab, setActiveTab] = useState(0);
  const [selectedMarket, setSelectedMarket] = useState<MarketData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ticketPackagesDialogOpen, setTicketPackagesDialogOpen] =
    useState(false);
  const [selectedMarketNumber, setSelectedMarketNumber] = useState<
    number | undefined
  >(undefined);
  const [joinMarketDialogOpen, setJoinMarketDialogOpen] = useState(false);
  const [joinMarketDialogMarket, setJoinMarketDialogMarket] =
    useState<MarketData | null>(null);
  const [joinMarketDialogMarketNumber, setJoinMarketDialogMarketNumber] =
    useState<number | undefined>(undefined);
  const [selectedFusedSlot, setSelectedFusedSlot] = useState<FusedSlot | null>(
    null
  );
  const [selectPhotoDialogOpen, setSelectPhotoDialogOpen] = useState(false);
  const [sellSuccessOpen, setSellSuccessOpen] = useState(false);
  const [sellSuccessData, setSellSuccessData] = useState<{
    exposuresCount: number;
    marketLabel: string;
  } | null>(null);

  const fusedSlotDialogTitle = selectedFusedSlot
    ? getFusedSlotBadgeLabel(
        selectedFusedSlot.slotNumber,
        photoFusion,
        selectedFusedSlot.name
      )
    : "";

  const INACTIVE_TAB_ICON = "#758599";

  const handleSellSuccess = useCallback(
    (data: { exposuresCount: number; marketLabel: string }) => {
      setSellSuccessData(data);
      setDialogOpen(false);
      // Show success dialog after sell dialog has closed (allow transition)
      setTimeout(() => setSellSuccessOpen(true), 350);
    },
    []
  );

  useEffect(() => {
    if (!sellSuccessOpen) return;
    return playSellSuccessChime();
  }, [sellSuccessOpen]);

  // Photo Fusion tab: locked unless at least 1 filled slot (has image) has score >= 4 and isPetrified false
  // Support both camelCase and snake_case; also check regular slots (in case data comes from /slots)
  const isEligibleSlot = (
    s:
      | FusedSlot
      | Slot
      | {
          imageUrl?: string | null;
          image_url?: string;
          score?: number;
          isPetrified?: boolean;
          is_petrified?: boolean;
        }
  ) => {
    const imageUrl =
      s.imageUrl ?? (s as { image_url?: string }).image_url ?? null;
    const filled = imageUrl != null && String(imageUrl) !== "";
    const scoreNum = Number(s.score ?? (s as { score?: number }).score);
    const notPetrified =
      (s.isPetrified ?? (s as { is_petrified?: boolean }).is_petrified) !==
      true;
    return filled && !Number.isNaN(scoreNum) && scoreNum >= 4.5 && notPetrified;
  };
  const hasEligibleFilledSlot =
    fusedSlots.some((s) => isEligibleSlot(s)) ||
    slots.some((s) => isEligibleSlot(s));
  const userPoints = authUser?.points ?? 0;
  const hasEnoughPoints = userPoints >= 5;
  const photoFusionTabLocked = !hasEligibleFilledSlot || !hasEnoughPoints;

  useEffect(() => {
    if (photoFusionTabLocked && activeTab === 1) setActiveTab(0);
  }, [photoFusionTabLocked, activeTab]);

  const photomoneTabs = [
    {
      label: photomone.tabs?.monetization ?? "Monetisation",
      icon: (isActive: boolean) => (
        <MonetizationIcon
          width={20}
          height={20}
          color={isActive ? COLORS.white : INACTIVE_TAB_ICON}
        />
      ),
    },
    {
      label: photomone.tabs?.photoFusion ?? "Photo Fusion",
      icon: (isActive: boolean) => (
        <PhotoFusionIcon
          width={20}
          height={20}
          color={isActive ? COLORS.white : INACTIVE_TAB_ICON}
        />
      ),
      disabled: photoFusionTabLocked,
    },
  ];

  const transformMarket = (market: Market): MarketData =>
    MarketService.transformMarket(market, translations);

  // entries > 0: show + icon, + click opens tickets dialog
  const showPlusIcon = (market: Market): boolean =>
    market.entries != null && market.entries > 0;

  // Purchase button: open Join Market dialog
  const handlePurchaseClick = (market: Market) => {
    const marketData = MarketService.transformMarket(market, translations);
    setJoinMarketDialogMarket(marketData);
    setJoinMarketDialogMarketNumber(market.marketNumber);
    setJoinMarketDialogOpen(true);
  };

  // Sell button: open Sell Photo dialog (same as previous Purchase behavior when not locked)
  const handleSellClick = (market: Market) => {
    const marketData = MarketService.transformMarket(market, translations);
    setSelectedMarket(marketData);
    setDialogOpen(true);
  };

  const handleTicketsClick = (marketNumber: number) => {
    setSelectedMarketNumber(marketNumber);
    setTicketPackagesDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMarket(null);
  };

  const handleCloseSelectPhotoDialog = () => {
    setSelectPhotoDialogOpen(false);
    setSelectedFusedSlot(null);
  };

  const handleFusedSlotAdd = (slot: FusedSlot) => {
    if (slot.isDisabled) return;
    setSelectedFusedSlot(slot);
    setSelectPhotoDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Box>
        <Box className="flex items-center justify-center py-20">
          <Loading size={48} />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Heading */}
      <DashboardHeading
        title={photomone.title || "PHOTOS+"}
        className="mb-6 lg:block hidden"
      />

      {/* Tabs */}
      <Box className="mb-4 sm:mb-6">
        <TabBar
          tabs={photomoneTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </Box>

      {/* Tab Content: 1 col on mobile, 3 col from sm (desktop unchanged) */}
      {activeTab === 0 && (
        <Box className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4  max-h-[calc(100vh-225px)] lg:max-h-[calc(100vh-290px)] overflow-y-auto">
          {markets.map((market) => (
            <MarketCard
              key={market.marketNumber}
              market={transformMarket(market)}
              showPlusIcon={showPlusIcon(market)}
              onTicketsClick={
                market.entries === 0 ||
                (market.entries != null && market.entries > 0)
                  ? () => handleTicketsClick(market.marketNumber)
                  : undefined
              }
              onClick={() => handlePurchaseClick(market)}
              onSellClick={() => handleSellClick(market)}
            />
          ))}
        </Box>
      )}

      {activeTab === 1 && (
        <PhotoFusionContent
          slots={fusedSlots}
          filledSlotsCount={filledSlotsCount}
          isLoading={isFusedSlotsLoading}
          onSlotAdd={handleFusedSlotAdd}
        />
      )}

      {/* Sell Photo Dialog */}
      {selectedMarket && (
        <MainDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          title={sellPhoto.title || "Sell Photo"}
        >
          <SellPhotoForm
            selectedMarket={selectedMarket}
            remainingEntries={selectedMarket.exposure ?? 10}
            slots={slots}
            onCancel={handleCloseDialog}
            onSuccess={handleSellSuccess}
          />
        </MainDialog>
      )}

      {/* Select photo for fused slot (Photo Fusion) */}
      <MainDialog
        open={selectPhotoDialogOpen}
        onClose={handleCloseSelectPhotoDialog}
        title={fusedSlotDialogTitle}
      >
        <SelectPhotoForFusedSlotForm
          primaryFusedSlotId={selectedFusedSlot?._id ?? ""}
          slots={slots}
          slotDisplayName={fusedSlotDialogTitle}
          onCancel={handleCloseSelectPhotoDialog}
          onSuccess={handleCloseSelectPhotoDialog}
        />
      </MainDialog>

      {/* Sell success dialog – same size as purchase congrats (400px) */}
      <Dialog
        open={sellSuccessOpen}
        onClose={() => setSellSuccessOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "visible",
            maxWidth: 400,
            boxShadow: sellSuccessOpen
              ? `0 24px 56px rgba(0,0,0,0.2), 0 0 0 1px ${COLORS.primary}20`
              : "none",
            border: `1px solid ${COLORS.border}`,
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            "&.MuiDialogContent-root": { padding: 0 },
            overflow: "visible",
          }}
        >
          <Box
            sx={{
              pt: 3,
              pb: 2,
              px: 3,
              textAlign: "center",
              background: `linear-gradient(180deg, ${COLORS.primary}12 0%, ${COLORS.primary}06 100%)`,
              borderBottom: `1px solid ${COLORS.border}`,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: `${COLORS.primary}25`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <CheckCircleOutlineIcon
                sx={{ fontSize: 36, color: COLORS.primary }}
              />
            </Box>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                color: COLORS.generalText,
                lineHeight: 1.5,
              }}
            >
              {(() => {
                const count = sellSuccessData?.exposuresCount ?? 0;
                const market = sellSuccessData?.marketLabel ?? "";
                const tpl =
                  count === 1
                    ? sellPhoto.sellSuccessOnce ||
                      "Your photo will appear 1 time in [[MARKET]]"
                    : (sellPhoto.sellSuccessMany ||
                        "Your photo will appear {count} times in [[MARKET]]"
                      ).replace("{count}", String(count));
                const parts = tpl.split("[[MARKET]]");
                return (
                  <>
                    {parts[0]}
                    <Box
                      component="span"
                      sx={{ color: COLORS.primary, fontWeight: 700 }}
                    >
                      {market}
                    </Box>
                    {parts[1] ?? ""}
                  </>
                );
              })()}
            </Typography>
          </Box>
          <Box sx={{ p: 2.5, display: "flex", justifyContent: "center" }}>
            <MainButton
              onClick={() => {
                setSellSuccessOpen(false);
                setSellSuccessData(null);
              }}
              color={COLORS.primary}
              className="!min-w-[140px] !rounded-full"
            >
              {sellPhoto.ok || "OK"}
            </MainButton>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Join Market Dialog */}
      <JoinMarketDialog
        open={joinMarketDialogOpen}
        onClose={() => {
          setJoinMarketDialogOpen(false);
          setJoinMarketDialogMarket(null);
          setJoinMarketDialogMarketNumber(undefined);
        }}
        market={joinMarketDialogMarket}
        marketNumber={joinMarketDialogMarketNumber}
      />

      {/* Ticket Packages Dialog */}
      <MainDialog
        open={ticketPackagesDialogOpen}
        onClose={() => {
          setTicketPackagesDialogOpen(false);
          setSelectedMarketNumber(undefined);
        }}
        title={ticketPackages.title || "Use Ticket"}
        maxWidth="sm"
      >
        <TicketPackagesDialog
          onClose={() => {
            setTicketPackagesDialogOpen(false);
            setSelectedMarketNumber(undefined);
          }}
          marketNumber={selectedMarketNumber}
        />
      </MainDialog>
    </Box>
  );
};

export default PhotomoneScreen;
