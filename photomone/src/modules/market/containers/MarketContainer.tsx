import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { MarketScreen } from "../screens";
import { useAuthContext, useLanguage } from "@providers";
import { COLORS, ROUTES } from "@constants";
import { MarketApis } from "@apis";
import { Loading, MainButton } from "@components";
import { Box, Typography } from "@mui/material";
import { translateMarketName } from "@utils";

export const MarketContainer = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authUser, isLoading: authLoading } = useAuthContext();
  const { translations } = useLanguage();
  const t = translations || {};
  const marketTranslations = t?.market || {};
  const container = marketTranslations?.container || {};
  const { data: mainMarketData, isLoading: marketLoading } =
    MarketApis.useGetMainMarket();

  // Clear mainMarket cache when navigating away (when user is not in market)
  useEffect(() => {
    if (
      authUser?.inMarket === false ||
      authUser?.inMarket === null ||
      authUser?.inMarket === undefined
    ) {
      queryClient.removeQueries({ queryKey: ["mainMarket"] });
    }
  }, [authUser?.inMarket, queryClient]);

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <Box className="flex items-center justify-center py-20">
        <Loading size={48} />
      </Box>
    );
  }

  // Show message if user is not in a market (instead of redirecting)
  if (
    authUser?.inMarket === false ||
    authUser?.inMarket === null ||
    authUser?.inMarket === undefined
  ) {
    return (
      <Box className="flex flex-col items-center justify-center py-20 px-4">
        <Box
          className="rounded-2xl p-8 max-w-md w-full text-center"
          sx={{
            backgroundColor: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            className="mb-4"
            sx={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: COLORS.generalText,
            }}
          >
            {container.notInMarket || "You are not in any market"}
          </Typography>
          <Typography
            className="font-inter mb-6"
            sx={{
              fontSize: "0.875rem",
              color: COLORS.grayStrong,
              lineHeight: 1.5,
            }}
          >
            {container.joinMarketFirst ||
              "Please join a market first to participate in photo trading."}
          </Typography>
          <MainButton
            onClick={() => navigate(`/dashboard/${ROUTES.photomone}`)}
            color={COLORS.primary}
            className="!rounded-full !min-w-[180px]"
          >
            {container.goToPhotomone || "Go to Photomone"}
          </MainButton>
        </Box>
      </Box>
    );
  }

  const isLoading = marketLoading;

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center py-20">
        <Loading size={48} />
      </Box>
    );
  }

  const market = mainMarketData?.data?.market;
  const rawMarketName = market?.marketName || "Market 1";
  const marketName = translateMarketName(rawMarketName, translations);
  // const category = market?.category || null;

  return <MarketScreen marketName={marketName} market={market} />;
};

export default MarketContainer;
