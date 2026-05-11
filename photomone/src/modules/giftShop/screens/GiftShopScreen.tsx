import { Box, Typography } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  DashboardHeading,
  DashboardSubHeading,
  TabBar,
  Loading,
} from "@components";
import { GiftCard } from "../components/GiftCard";
import { PointsPackageCard } from "../components/PointsPackageCard";
import { PackagePurchaseTable } from "../components/PackagePurchaseTable";
import { GiftCardPurchaseTable } from "../components/GiftCardPurchaseTable";
import { ShopApis } from "@apis";
import { useAppContext, useLanguage } from "@providers";
import { GiftShopIcon, PointsShopIcon, ViewListIcon } from "@assets/icons/svg";
import { COLORS } from "@constants";
import type { ShopPackage, GiftShopItem } from "@types";

const HISTORY_PAGE_LIMIT = 10;

export const GiftShopScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [historyPage, setHistoryPage] = useState(1);
  const [giftCardHistoryPage, setGiftCardHistoryPage] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { translations } = useLanguage();

  const t = translations || {};
  const shop = t.shop || {};
  const pointsPackage = shop.pointsPackage || {};
  const packNames = (shop.packNames || {}) as Record<string, string>;

  const shopTabs = [
    {
      label: shop.tabs?.giftsShop || "Gifts",
      icon: (isActive: boolean) => (
        <GiftShopIcon
          width={20}
          height={20}
          color={isActive ? COLORS.white : "#758599"}
        />
      ),
    },
    {
      label: shop.tabs?.pointsShop || "Points Shop",
      icon: (isActive: boolean) => (
        <PointsShopIcon
          width={20}
          height={20}
          color={isActive ? COLORS.white : "#758599"}
        />
      ),
    },
    {
      label: shop.tabs?.history || "History",
      icon: (isActive: boolean) => (
        <ViewListIcon
          width={20}
          height={20}
          color={isActive ? COLORS.white : "#758599"}
        />
      ),
    },
  ];

  // Fetch gift shop items from API
  const { data: giftShopData, isLoading: isLoadingGiftShop } =
    ShopApis.useGetGiftShop();
  const giftShopItems = giftShopData?.data || [];

  // Fetch packages from API
  const { data: packagesData, isLoading } = ShopApis.useGetShopPackages();
  const packages = packagesData?.data || [];

  // Fetch my packages (purchase history) when History tab is active
  const { data: myPackagesData, isLoading: isLoadingHistory } =
    ShopApis.useGetMyPackages(historyPage);
  const historyData = myPackagesData?.data;
  const historyPurchases = historyData?.data ?? [];
  const historyPagination = historyData?.pagination ?? null;

  // Fetch my gift card purchases (history) when History tab is active
  const { data: giftCardPurchasesData, isLoading: isLoadingGiftCardHistory } =
    ShopApis.useGetMyGiftCardPurchases(giftCardHistoryPage);
  const giftCardHistoryData = giftCardPurchasesData?.data;
  const giftCardPurchases = giftCardHistoryData?.data ?? [];
  const giftCardPagination = giftCardHistoryData?.pagination ?? null;

  // Handle success/failed query parameters
  useEffect(() => {
    const success = searchParams.get("success");
    const failed = searchParams.get("failed");
    const pointShop = searchParams.get("pointShop");
    const pointsShop = searchParams.get("pointsShop");

    // Activate points shop tab if pointsShop or pointShop query parameter exists
    if (pointsShop !== null || pointShop !== null) {
      setActiveTab(1);
    }

    // Also activate if pointShop=true and success/failed exists (for backward compatibility)
    if ((success !== null || failed !== null) && pointShop === "true") {
      setActiveTab(1);
    }

    if (success !== null) {
      let message = shop.purchaseSuccess || "Purchase completed successfully!";
      if (success) {
        const raw = decodeURIComponent(success).trim();
        const match = raw.match(
          /(?:you have )?successfully purchased (.+?)(?:!|\.)?$/i
        );
        const packRaw = match ? match[1].replace(/[!.]$/, "").trim() : "";
        const template =
          pointsPackage.purchaseSuccessTemplate ||
          "You have successfully purchased {pack}!";
        const packTranslated = (packRaw && packNames[packRaw]) || packRaw || "";
        if (packTranslated) {
          message = template.replace("{pack}", packTranslated);
        }
      }
      showToast(message, "success");
    }

    if (failed !== null) {
      const message =
        shop.purchaseFailed || "Purchase failed. Please try again.";
      showToast(message, "error");
    }

    // Clean up URL by removing query parameters after processing
    if (
      success !== null ||
      failed !== null ||
      pointsShop !== null ||
      pointShop !== null
    ) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("success");
      newSearchParams.delete("failed");
      newSearchParams.delete("pointsShop");
      newSearchParams.delete("pointShop");

      const newSearch = newSearchParams.toString();
      navigate(`/dashboard/shop${newSearch ? `?${newSearch}` : ""}`, {
        replace: true,
      });
    }
  }, [searchParams, showToast, navigate, shop, pointsPackage, packNames]);

  // Helper function to translate pack names from backend
  const translatePackName = (packName: string): string => {
    const packNames = shop.packNames || {};
    return packNames[packName] || packName;
  };

  // Helper function to translate ticket descriptions from backend
  const translateTicketDescription = (description: string): string => {
    // Check if description matches "Get a ticket worth $X" pattern
    const ticketPattern = /Get a ticket worth (\$[\d,]+)/i;
    const match = description.match(ticketPattern);

    if (match && shop.ticketDescription) {
      const amount = match[1]; // e.g., "$10", "$20", etc.
      return shop.ticketDescription.replace("{amount}", amount);
    }

    // If pattern doesn't match, return original description
    return description;
  };

  // Map API packages to component format
  const mappedPackages = useMemo(() => {
    return packages.map((pkg: ShopPackage) => {
      // Format points with commas
      const formattedPoints = pkg.points.toLocaleString();
      const formattedTotal = pkg.total.toLocaleString();

      // Determine if featured (Popular pack)
      const isFeatured = pkg.packType === "POPULAR";

      // Translate pack name
      const translatedName = translatePackName(pkg.name);

      // Translate description
      const translatedDescription = translateTicketDescription(pkg.description);

      return {
        id: pkg.packType,
        title: translatedName,
        price: `$${pkg.price}`,
        points: formattedPoints,
        total: formattedTotal,
        bonus: pkg.bonus > 0 ? pkg.bonus.toLocaleString() : undefined,
        description: translatedDescription,
        featured: isFeatured,
        badge: isFeatured
          ? shop.pointsPackage?.mostPopular || "Most Popular"
          : undefined,
      };
    });
  }, [packages, shop]);

  // tooltip={shop.tooltip || "Purchase gift cards or points using your earned points."}

  return (
    <Box>
      <DashboardHeading
        title={shop.title || "Shop"}
        className="mb-6 lg:block hidden"
      />

      <TabBar
        tabs={shopTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-4 lg:mb-6"
      />

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {isLoadingGiftShop ? (
            <Box className="flex items-center justify-center py-20">
              <Loading size={48} />
            </Box>
          ) : giftShopItems.length > 0 ? (
            <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-h-[calc(100vh-225px)] lg:max-h-[calc(100vh-290px)] overflow-y-auto">
              {giftShopItems.map((item: GiftShopItem) => (
                <GiftCard key={item.id} giftCard={item} />
              ))}
            </Box>
          ) : (
            <Box className="flex items-center justify-center py-20">
              <Box className="text-center">
                <Typography className="text-white/50 font-proxima text-sm">
                  {shop.noGiftCards || "No gift cards available"}
                </Typography>
              </Box>
            </Box>
          )}
        </>
      )}

      {activeTab === 1 && (
        <Box>
          {isLoading ? (
            <Box className="flex items-center justify-center py-20">
              <Loading size={48} />
            </Box>
          ) : (
            <Box className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[calc(100vh-225px)] lg:max-h-[calc(100vh-290px)] overflow-y-auto">
              {mappedPackages.map((pack) => (
                <PointsPackageCard key={pack.id} {...pack} />
              ))}
            </Box>
          )}
        </Box>
      )}

      {activeTab === 2 && (
        <Box className="w-full min-w-0 max-w-full overflow-x-hidden flex flex-col gap-8 max-h-[calc(100vh-225px)] lg:max-h-[calc(100vh-290px)] overflow-y-auto">
          <Box className="min-w-0 max-w-full">
            <DashboardSubHeading
              title={
                shop.historySection?.pointsPackagesTitle || "Purchased Packages"
              }
              className="mb-1"
            />
            <PackagePurchaseTable
              purchases={historyPurchases}
              loading={isLoadingHistory}
              pagination={historyPagination}
              page={historyPage}
              limit={HISTORY_PAGE_LIMIT}
              onPageChange={setHistoryPage}
            />
          </Box>
          <Box className="min-w-0 max-w-full">
            <DashboardSubHeading
              title={shop.historySection?.giftCardsTitle || "Purchased Gift Cards"}
              className="mb-1"
            />
            <GiftCardPurchaseTable
              purchases={giftCardPurchases}
              loading={isLoadingGiftCardHistory}
              pagination={giftCardPagination}
              page={giftCardHistoryPage}
              limit={HISTORY_PAGE_LIMIT}
              onPageChange={setGiftCardHistoryPage}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default GiftShopScreen;
