import { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { DashboardHeading, TabBar, Loading } from "@components";
import {
  StatCard,
  ResultSlot,
  ResultHistoryTable,
  FusionHistoryTable,
  ExposuresTableDialog,
} from "../components";
import type {
  ExposureResult,
  Exposure,
  FusionResult,
  ExposureResultsPagination,
  ExposureResultsCounts,
  FusionResultsPagination,
} from "@types";
import { PurchaseApis } from "@apis";

import { useLanguage } from "@providers";
import { COLORS } from "@constants";
import {
  ViewListIcon,
  ExposureIcon,
  SalesIcon,
  SellingRateIcon,
  EarningsIcon,
  ResultPurchasedIcon,
  ResultTradingIcon,
  ResultFusionIcon,
} from "@assets/icons/svg";

const INACTIVE_TAB_ICON = "#758599";

interface ResultScreenProps {
  exposureResults: ExposureResult[];
  loading?: boolean;
  pagination?: ExposureResultsPagination | null;
  counts?: ExposureResultsCounts | null;
  exposurePage?: number;
  onExposurePageChange?: (page: number) => void;
  exposures?: Exposure[];
  loadingExposures?: boolean;
  fusionResults?: FusionResult[];
  loadingFusion?: boolean;
  fusionPagination?: FusionResultsPagination | null;
  fusionPage?: number;
  onFusionPageChange?: (page: number) => void;
  fusionPageLimit?: number;
}

const EXPOSURE_PAGE_LIMIT = 10;

export const ResultScreen = ({
  exposureResults,
  loading = false,
  pagination = null,
  counts = null,
  exposurePage = 1,
  onExposurePageChange,
  exposures = [],
  loadingExposures = false,
  fusionResults = [],
  loadingFusion = false,
  fusionPagination = null,
  fusionPage = 1,
  onFusionPageChange,
  fusionPageLimit = 10,
}: ResultScreenProps) => {
  const { translations } = useLanguage();
  const t = translations || {};
  const resultTranslations = t?.result || {};
  const tabs = resultTranslations?.tabs || {};
  const stats = resultTranslations?.stats || {};
  const resultA11y = resultTranslations?.a11y || {};

  const resultTabs = [
    {
      label: tabs.purchased || "Purchased",
      icon: (isActive: boolean) => (
        <ResultPurchasedIcon
          color={isActive ? "white" : INACTIVE_TAB_ICON}
          width={20}
          height={20}
        />
      ),
    },
    {
      label: tabs.trading || "Trading",
      icon: (isActive: boolean) => (
        <ResultTradingIcon
          color={isActive ? "white" : INACTIVE_TAB_ICON}
          width={20}
          height={20}
        />
      ),
    },
    {
      label: tabs.fusion || "Fusion",
      icon: (isActive: boolean) => (
        <ResultFusionIcon
          color={isActive ? "white" : INACTIVE_TAB_ICON}
          width={20}
          height={20}
        />
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState(0);
  const [showAllSlots, setShowAllSlots] = useState(false);
  const [exposuresDialogOpen, setExposuresDialogOpen] = useState(false);

  // Fetch purchased images
  const { data: purchasedImagesData, isLoading: isLoadingPurchases } =
    PurchaseApis.useGetPurchasedImages();
  const purchases = purchasedImagesData?.data?.purchases || [];

  // Create a map of purchases by index for easy lookup
  const purchasesByIndex = useMemo(() => {
    const map = new Map<number, (typeof purchases)[0]>();
    purchases.forEach((purchase) => {
      map.set(purchase.index, purchase);
    });
    return map;
  }, [purchases]);

  // Determine the maximum number of slots (either from purchases or default to 6)
  const maxSlots = useMemo(() => {
    if (purchases.length === 0) return 6; // Default to 6 if no purchases
    const maxIndex = Math.max(...purchases.map((p) => p.index));
    return Math.max(maxIndex, 6); // At least 6 slots
  }, [purchases]);

  // Show more/less logic - show 7 slots initially
  const hasMoreThan7Slots = maxSlots > 7;
  const displayedSlotsCount = hasMoreThan7Slots && !showAllSlots ? 7 : maxSlots;

  // Use server counts when available, else fallback to client compute from current page
  const totalExposures = counts?.exposures ?? exposureResults?.length ?? 0;
  const totalSales =
    counts?.totalSales ?? exposureResults?.filter((r) => r.isSold).length ?? 0;
  const sellingRatePercentage =
    counts?.sellingRate ??
    (totalExposures > 0 ? (totalSales / totalExposures) * 100 : 0);
  const totalEarnings =
    counts?.earnings ??
    exposureResults?.reduce(
      (sum, r) => sum + (r.isSold ? r.purchasePoints || 0 : 0),
      0
    ) ??
    0;

  // Determine color based on selling rate
  const getSellingRateColor = (percentage: number) => {
    if (percentage < 25) return "#EF4444";
    if (percentage >= 25 && percentage < 50) return "#3B82F6";
    if (percentage >= 50 && percentage < 75) return "#22C55E";
    return "#FFD700";
  };

  const statsData = [
    {
      id: "total",
      label: stats.exposures || "Exposures",
      value: totalExposures,
      color: COLORS.secondary,
      icon: <ExposureIcon />,
    },
    {
      id: "wins",
      label: stats.totalSales || "Total Sales",
      value: totalSales,
      color: "#29C4D6",
      icon: <SalesIcon />,
    },
    {
      id: "winrate",
      label: stats.sellingRate || "Selling Rate",
      value: `${sellingRatePercentage.toFixed(1)}%`,
      color: getSellingRateColor(sellingRatePercentage),
      icon: <SellingRateIcon />,
    },
    {
      id: "earned",
      label: stats.earnings || "Earnings",
      value: `${totalEarnings}`,
      color: "#29C4D6",
      icon: <EarningsIcon />,
    },
  ];

  return (
    <Box className="h-full w-full overflow-hidden">
      <DashboardHeading
        title={resultTranslations.title || "Results"}
        className="lg:block hidden"
      />

      {/* Stats Cards */}
      <Box className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 mb-4 lg:my-6">
        {statsData.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            icon={stat.icon}
            onClick={
              stat.id === "total"
                ? () => setExposuresDialogOpen(true)
                : undefined
            }
            actionIcon={stat.id === "total" ? <ViewListIcon /> : undefined}
            onActionClick={
              stat.id === "total"
                ? () => setExposuresDialogOpen(true)
                : undefined
            }
            actionAriaLabel={
              stat.id === "total"
                ? resultA11y.viewExposuresList ||
                  resultTranslations.viewExposures
                : undefined
            }
          />
        ))}
      </Box>

      {/* Tabs */}
      <TabBar
        tabs={resultTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-4"
      />

      {/* Tab Content - Fixed height container with internal scroll */}
      <Box className="rounded-lg w-full">
        {activeTab === 0 ? (
          <>
            {isLoadingPurchases ? (
              <Box className="flex items-center justify-center py-20">
                <Loading size={48} />
              </Box>
            ) : (
              <>
                {/* Mobile Gallery Layout - 3 columns with consistent spacing */}
                <Box className="block sm:hidden max-h-[calc(100vh-410px)] overflow-y-auto">
                  <Box
                    className=""
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "0.75rem", // Consistent 12px gap for both horizontal and vertical
                    }}
                  >
                    {Array.from({ length: displayedSlotsCount }).map(
                      (_, index) => {
                        const purchase = purchasesByIndex.get(index + 1);
                        return (
                          <ResultSlot
                            key={purchase?._id || index}
                            variant="mobile"
                            purchase={purchase}
                            slotNumber={index + 1}
                          />
                        );
                      }
                    )}
                    {hasMoreThan7Slots && !showAllSlots && (
                      <Box
                        onClick={() => setShowAllSlots(true)}
                        className="bg-white border relative flex flex-col items-center justify-center gap-1 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        sx={{ borderColor: COLORS.grayLight }}
                      >
                        <Typography
                          className="font-medium text-sm"
                          sx={{ color: COLORS.generalText }}
                        >
                          {resultTranslations.slot?.showMore || "Show more"}
                        </Typography>
                      </Box>
                    )}
                    {hasMoreThan7Slots && showAllSlots && (
                      <Box
                        onClick={() => setShowAllSlots(false)}
                        className="bg-white border relative flex flex-col items-center justify-center gap-1 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        sx={{ borderColor: COLORS.grayLight }}
                      >
                        <Typography
                          className="font-medium text-sm"
                          sx={{ color: COLORS.generalText }}
                        >
                          {resultTranslations.slot?.showLess || "Show less"}
                        </Typography>
                      </Box>
                    )}
                    <ResultSlot
                      isAddSlot
                      variant="mobile"
                      currentSlots={purchases.length}
                    />
                  </Box>
                </Box>

                {/* Desktop/Tablet Layout - Light card */}
                <Box className="hidden sm:block max-h-[calc(100vh-390px)] overflow-y-auto">
                  <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 justify-items-center max-w-[1200px] mx-auto">
                    {Array.from({ length: displayedSlotsCount }).map(
                      (_, index) => {
                        const purchase = purchasesByIndex.get(index + 1);
                        return (
                          <ResultSlot
                            key={purchase?._id || index}
                            variant="desktop"
                            purchase={purchase}
                            slotNumber={index + 1}
                          />
                        );
                      }
                    )}
                    {hasMoreThan7Slots && !showAllSlots && (
                      <Box
                        onClick={() => setShowAllSlots(true)}
                        className="aspect-square w-full max-w-[400px] bg-white border relative flex flex-col items-center justify-center gap-5 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        sx={{ borderColor: COLORS.grayLight }}
                      >
                        <Typography
                          className="font-medium text-lg"
                          sx={{ color: COLORS.generalText }}
                        >
                          {resultTranslations.slot?.showMore || "Show more"}
                        </Typography>
                      </Box>
                    )}
                    {hasMoreThan7Slots && showAllSlots && (
                      <Box
                        onClick={() => setShowAllSlots(false)}
                        className="aspect-square w-full max-w-[400px] bg-white border relative flex flex-col items-center justify-center gap-5 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        sx={{ borderColor: COLORS.grayLight }}
                      >
                        <Typography
                          className="font-medium text-lg"
                          sx={{ color: COLORS.generalText }}
                        >
                          {resultTranslations.slot?.showLess || "Show less"}
                        </Typography>
                      </Box>
                    )}
                    <ResultSlot
                      isAddSlot
                      variant="desktop"
                      currentSlots={purchases.length}
                    />
                  </Box>
                </Box>
              </>
            )}
          </>
        ) : activeTab === 1 ? (
          <Box
            className="h-[calc(100vh-410px)] sm:h-[calc(100vh-390px)] overflow-hidden flex flex-col w-full"
            sx={{ minHeight: 0 }}
          >
            <ResultHistoryTable
              exposureResults={exposureResults}
              loading={loading}
              pagination={pagination}
              page={exposurePage}
              limit={EXPOSURE_PAGE_LIMIT}
              onPageChange={onExposurePageChange}
            />
          </Box>
        ) : (
          <Box
            className="h-[calc(100vh-410px)] sm:h-[calc(100vh-390px)] overflow-hidden flex flex-col w-full"
            sx={{ minHeight: 0 }}
          >
            <FusionHistoryTable
              fusionResults={fusionResults}
              loading={loadingFusion}
              pagination={fusionPagination}
              page={fusionPage}
              limit={fusionPageLimit}
              onPageChange={onFusionPageChange}
            />
          </Box>
        )}
      </Box>

      {/* Exposures Table Dialog */}
      <ExposuresTableDialog
        open={exposuresDialogOpen}
        onClose={() => setExposuresDialogOpen(false)}
        exposures={exposures}
        loading={loadingExposures}
      />
    </Box>
  );
};
