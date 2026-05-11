import { useState } from "react";
import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { MainButton, Loading } from "@components";
import { TicketApis, MarketApis } from "@apis";
import { useAppContext, useLanguage } from "@providers";
import { COLORS } from "@constants";

interface TicketPackagesDialogProps {
  onClose: () => void;
  onSelect?: (packageId: string, packagePrice: number) => void;
  marketNumber?: number;
}

// Pill badge: teal for $100, pink for $50 and $10 (match screenshot)
const getPriceBadgeStyle = (price: number) =>
  price >= 100
    ? { backgroundColor: COLORS.primary }
    : { backgroundColor: COLORS.secondary };

export const TicketPackagesDialog = ({
  onClose,
  onSelect,
  marketNumber,
}: TicketPackagesDialogProps) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const purchaseMarketMutation = MarketApis.usePurchaseMarket();
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const t = translations || {};
  const photomone = t?.photomone || {};
  const ticketPackagesT = photomone?.ticketPackages || {};
  const shop = t?.shop || {};
  const packNames = shop?.packNames || {};

  // Helper function to translate pack names from backend
  const translatePackName = (packName: string): string => {
    return packNames[packName] || packName;
  };

  // Fetch ticket packages from API (with marketNumber so entries are for this market)
  const { data: ticketsData, isLoading } =
    TicketApis.useGetMyTickets(marketNumber);
  const allTickets = Array.isArray(ticketsData?.data) ? ticketsData.data : [];
  // Only show unused tickets (can be used to unlock market)
  const ticketPackages = allTickets.filter((pkg) => !pkg.isUsed);

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const handleUse = () => {
    if (!selectedPackage || !marketNumber) return;

    const selectedPkg = ticketPackages.find(
      (pkg) => pkg._id === selectedPackage
    );
    if (!selectedPkg) return;

    // Call purchase market API with ticketId
    purchaseMarketMutation.mutate(
      { marketNumber, ticketId: selectedPackage },
      {
        onSuccess: () => {
          const successMessage = (
            ticketPackagesT.unlockSuccess ||
            "Market {marketNumber} unlocked successfully!"
          ).replace("{marketNumber}", marketNumber.toString());
          showToast(successMessage, "success");
          // Call onSelect callback with package info
          if (onSelect) {
            onSelect(selectedPackage, selectedPkg.price);
          }
          // Close the dialog
          onClose();
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            ticketPackagesT.purchaseFailed ||
            "Failed to purchase market. Please try again.";
          showToast(errorMessage, "error");
        },
      }
    );
  };

  return (
    <Box className="flex flex-col pt-2">
      <Box className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-[calc(100vh-200px)]">
        {isLoading ? (
          <Box className="flex items-center justify-center py-20">
            <Loading size={48} />
          </Box>
        ) : ticketPackages.length > 0 ? (
          ticketPackages.map((pkg) => {
            const isSelected = selectedPackage === pkg._id;
            return (
              <Box
                key={pkg._id}
                onClick={() => handlePackageSelect(pkg._id)}
                className="relative cursor-pointer transition-all duration-200 rounded-xl p-4"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: isSelected
                    ? `${COLORS.secondary}18`
                    : COLORS.white,
                  border: `1px solid ${isSelected ? COLORS.secondary : COLORS.border}`,
                  "&:hover": {
                    backgroundColor: isSelected
                      ? `${COLORS.secondary}18`
                      : "transparent",
                  },
                }}
              >
                {/* Price pill on the left */}
                <Box
                  className="rounded-lg h-[48px] w-[48px] flex items-center justify-center mr-4"
                  sx={{
                    ...getPriceBadgeStyle(pkg.price),
                  }}
                >
                  <Typography className="text-white font-semibold text-normal">
                    ${pkg.price}
                  </Typography>
                </Box>

                {/* Package name and entries */}
                <Box className="flex-1 min-w-0">
                  <Typography
                    className="font-semibold font-inter text-base"
                    sx={{ color: COLORS.generalText }}
                  >
                    {translatePackName(pkg.ticketName)}
                  </Typography>
                  <Typography
                    className="font-inter text-sm"
                    sx={{ color: COLORS.grayStrong }}
                  >
                    {pkg.entries ?? 0}{" "}
                    {ticketPackagesT.entries || "Entries"}
                  </Typography>
                </Box>

                {/* Selected: checkmark badge top-right */}
                {isSelected && (
                  <Box
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                    sx={{ backgroundColor: COLORS.secondary }}
                  >
                    <CheckIcon sx={{ color: COLORS.white, fontSize: 16 }} />
                  </Box>
                )}
              </Box>
            );
          })
        ) : (
          <Box className="text-center py-12">
            <Typography
              className="font-inter text-sm"
              sx={{ color: COLORS.grayStrong }}
            >
              {ticketPackagesT.noPackagesAvailable ||
                "No tickets. Buy a package."}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Use button - solid teal, centered */}
      <Box className="flex justify-center pt-4 border-t border-[#E0E0E0]">
        <MainButton
          onClick={handleUse}
          disabled={!selectedPackage || purchaseMarketMutation.isPending}
          color={COLORS.primary}
          className="!min-w-[200px] !rounded-full"
        >
          {purchaseMarketMutation.isPending
            ? ticketPackagesT.processing || "Processing..."
            : ticketPackagesT.use || "Use"}
        </MainButton>
      </Box>
    </Box>
  );
};
