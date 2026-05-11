import { useState } from "react";
import { ResultScreen } from "../screens";
import { MarketApis, SlotApis } from "@apis";
import type {
  ExposureResultsPagination,
  ExposureResultsCounts,
  FusionResultsPagination,
} from "@types";

const EXPOSURE_PAGE_LIMIT = 10;
const FUSION_PAGE_LIMIT = 10;

export const ResultContainer = () => {
  const [exposurePage, setExposurePage] = useState(1);
  const [fusionPage, setFusionPage] = useState(1);
  const { data: exposureResultsData, isLoading } = MarketApis.useGetExposureResults(
    exposurePage,
    EXPOSURE_PAGE_LIMIT
  );
  const { data: exposuresData, isLoading: isLoadingExposures } = MarketApis.useGetExposures();
  const { data: fusionResultsData, isLoading: loadingFusion } =
    SlotApis.useGetFusionResults(fusionPage, FUSION_PAGE_LIMIT);

  const exposureResults = exposureResultsData?.data?.exposureResults ?? [];
  const pagination: ExposureResultsPagination | null =
    exposureResultsData?.data?.pagination ?? null;
  const counts: ExposureResultsCounts | null = exposureResultsData?.data?.counts ?? null;
  const exposures = exposuresData?.data ?? [];
  const fusionResults = fusionResultsData?.data?.results ?? [];
  const fusionPagination: FusionResultsPagination | null =
    fusionResultsData?.data?.pagination ?? null;

  return (
    <ResultScreen
      exposureResults={exposureResults}
      loading={isLoading}
      pagination={pagination}
      counts={counts}
      exposurePage={exposurePage}
      onExposurePageChange={setExposurePage}
      exposures={exposures}
      loadingExposures={isLoadingExposures}
      fusionResults={fusionResults}
      loadingFusion={loadingFusion}
      fusionPagination={fusionPagination}
      fusionPage={fusionPage}
      onFusionPageChange={setFusionPage}
      fusionPageLimit={FUSION_PAGE_LIMIT}
    />
  );
};

