import { AppsOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { COLORS, ROUTES } from "@constants";
import { IChild, IChildApp, IChildAppFilter } from "@types";

interface ChildDetailsScreenProps {
  apps: IChildApp[];
  child: IChild | null;
  isAppTableLoading: boolean;
  isProfileLoading: boolean;
  onBack: () => void;
  onFilterChange: (filter: IChildAppFilter) => void;
  onToggleRestriction: (appId: string, blocked: boolean) => Promise<void>;
  selectedFilter: IChildAppFilter;
  updatingAppId: string | null;
}

const ROWS_PER_PAGE = 8;
const FILTER_OPTIONS: IChildAppFilter[] = ["today", "week", "month"];

const detailCardStyle = {
  backgroundColor: COLORS.white,
  border: `1px solid ${COLORS.border}`,
  boxShadow: `0 4px 16px ${COLORS.border}`,
};

const formatUsage = (
  usage?: { hours: number; minutes: number; seconds: number },
) => {
  if (!usage) {
    return "0s";
  }

  const parts = [
    usage.hours > 0 ? `${usage.hours}h` : null,
    usage.minutes > 0 ? `${usage.minutes}m` : null,
    usage.seconds > 0 ? `${usage.seconds}s` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" ") : "0s";
};

export const ChildDetailsScreen = ({
  apps,
  child,
  isAppTableLoading,
  isProfileLoading,
  onBack,
  onFilterChange,
  onToggleRestriction,
  selectedFilter,
  updatingAppId,
}: ChildDetailsScreenProps) => {
  const safeApps = Array.isArray(apps) ? apps : [];
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(safeApps.length / ROWS_PER_PAGE));

  const paginatedApps = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return safeApps.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [currentPage, safeApps]);

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter]);

  const startRow =
    safeApps.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endRow = Math.min(currentPage * ROWS_PER_PAGE, safeApps.length);

  if (!child && !isProfileLoading) {
    return (
      <Box className="space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium"
          style={{ color: COLORS.primary }}
        >
          Back to Child Overview
        </button>

        <Box className="rounded-2xl p-8 text-center" sx={detailCardStyle}>
          <h1
            className="text-2xl font-bold mb-3"
            style={{ color: COLORS.generalText }}
          >
            Child not found
          </h1>
          <p style={{ color: COLORS.generalText, opacity: 0.75 }}>
            We could not find a child for this link. Return to{" "}
            {ROUTES.childOverview} and choose another child card.
          </p>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium"
        style={{ color: COLORS.primary }}
      >
        Back to Child Overview
      </button>

      <Box
        className="rounded-2xl p-6 lg:p-8"
        sx={{
          ...detailCardStyle,
          background: `linear-gradient(135deg, ${COLORS.white} 0%, ${COLORS.primary}08 100%)`,
        }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p
              className="text-sm font-medium uppercase tracking-[0.2em] mb-2"
              style={{ color: COLORS.primary }}
            >
              Child Profile
            </p>
            <h1
              className="text-3xl font-bold"
              style={{ color: COLORS.generalText }}
            >
              {child?.name ?? "Loading child..."}
            </h1>
            <p
              className="text-sm mt-2"
              style={{ color: COLORS.generalText, opacity: 0.75 }}
            >
              Overview for the selected child account linked to your parent dashboard.
            </p>
          </div>

          <span
            className="inline-flex items-center justify-center text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: `${COLORS.primary}22`,
              color: COLORS.primary,
            }}
          >
            {child ? "Connected" : "Loading"}
          </span>
        </div>
      </Box>

      <Box>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-4">
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: COLORS.generalText }}
            >
              Installed Apps
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: COLORS.generalText, opacity: 0.72 }}
            >
              Manage the apps detected for {child?.name ?? "this child"}.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="flex flex-wrap items-center gap-2">
              {FILTER_OPTIONS.map((filter) => {
                const isActive = filter === selectedFilter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => onFilterChange(filter)}
                    className="px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors"
                    style={{
                      color: isActive ? COLORS.white : COLORS.generalText,
                      backgroundColor: isActive ? COLORS.primary : COLORS.white,
                      border: `1px solid ${isActive ? COLORS.primary : COLORS.border}`,
                      boxShadow: isActive ? `0 6px 18px ${COLORS.primary}26` : "none",
                    }}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            {safeApps.length > 0 && !isAppTableLoading && (
              <p
                className="text-sm"
                style={{ color: COLORS.generalText, opacity: 0.72 }}
              >
                Showing {startRow}-{endRow} of {safeApps.length} apps
              </p>
            )}
          </div>
        </div>

        {isAppTableLoading ? (
          <Box
            className="rounded-xl flex flex-col items-center justify-center py-16"
            sx={{
              border: `1px solid ${COLORS.border}`,
              boxShadow: `0 2px 12px ${COLORS.border}`,
              backgroundColor: COLORS.white,
            }}
          >
            <Box
              className="relative flex items-center justify-center"
              sx={{
                width: 78,
                height: 78,
                animation: "float-y 3.2s ease-in-out infinite",
              }}
            >
              <Box
                className="absolute inset-0 rounded-full"
                sx={{
                  background: `radial-gradient(circle, ${COLORS.primary}18 0%, transparent 70%)`,
                  animation: "pulse-ring 1.9s ease-in-out infinite",
                }}
              />
              <Box
                className="absolute rounded-full"
                sx={{
                  inset: 8,
                  border: `3px solid ${COLORS.primary}35`,
                  borderTopColor: COLORS.primary,
                  animation: "spin 1s linear infinite",
                }}
              />
              <Box
                className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center"
                sx={{
                  color: COLORS.primary,
                  backgroundColor: `${COLORS.primary}16`,
                  boxShadow: `0 10px 24px ${COLORS.primary}18`,
                }}
              >
                <AppsOutlined fontSize="small" />
              </Box>
            </Box>
            <p
              className="text-sm mt-4 font-medium"
              style={{ color: COLORS.generalText }}
            >
              Loading apps...
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: COLORS.generalText, opacity: 0.65 }}
            >
              Pulling the latest usage and restriction data for this child.
            </p>
          </Box>
        ) : (
          <Box
            component="table"
            className="w-full border-collapse rounded-xl overflow-hidden"
            sx={{
              border: `1px solid ${COLORS.border}`,
              boxShadow: `0 2px 12px ${COLORS.border}`,
            }}
          >
            <thead>
              <tr style={{ backgroundColor: `${COLORS.primary}18` }}>
                <th
                  className="text-left py-4 px-5 text-sm font-semibold"
                  style={{ color: COLORS.generalText }}
                >
                  #
                </th>
                <th
                  className="text-left py-4 px-5 text-sm font-semibold"
                  style={{ color: COLORS.generalText }}
                >
                  App
                </th>
                <th
                  className="text-left py-4 px-5 text-sm font-semibold"
                  style={{ color: COLORS.generalText }}
                >
                  App Used
                </th>
                <th
                  className="text-left py-4 px-5 text-sm font-semibold"
                  style={{ color: COLORS.generalText }}
                >
                  Status
                </th>
                <th
                  className="text-right py-4 px-5 text-sm font-semibold"
                  style={{ color: COLORS.generalText }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {safeApps.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-sm"
                    style={{ color: COLORS.generalText }}
                  >
                    No apps found for this child yet.
                  </td>
                </tr>
              ) : (
                paginatedApps.map((app, index) => {
                  const absoluteIndex =
                    (currentPage - 1) * ROWS_PER_PAGE + index;
                  const isBlocked = app.blocked;

                  return (
                    <tr
                      key={app._id}
                      style={{
                        backgroundColor:
                          absoluteIndex % 2 === 0
                            ? COLORS.white
                            : `${COLORS.primary}08`,
                      }}
                    >
                      <td
                        className="py-4 px-5 text-sm"
                        style={{ color: COLORS.generalText }}
                      >
                        {absoluteIndex + 1}
                      </td>
                      <td className="py-4 px-5 text-sm">
                        <div className="flex items-center gap-3">
                          {app.icon ? (
                            <img
                              src={app.icon}
                              alt={app.appName}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                          ) : (
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold"
                              style={{
                                color: COLORS.primary,
                                backgroundColor: `${COLORS.primary}18`,
                              }}
                            >
                              {app.appName.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p
                              className="font-medium"
                              style={{ color: COLORS.generalText }}
                            >
                              {app.appName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td
                        className="py-4 px-5 text-sm"
                        style={{ color: COLORS.generalText }}
                      >
                        {formatUsage(app.appUsage)}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className="text-xs font-medium px-3 py-1.5 rounded-full"
                          style={{
                            backgroundColor: isBlocked
                              ? `${COLORS.secondary}22`
                              : `${COLORS.primary}22`,
                            color: isBlocked ? COLORS.secondary : COLORS.primary,
                          }}
                        >
                          {isBlocked ? "Restricted" : "Unrestricted"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        {isBlocked ? (
                          <button
                            type="button"
                            onClick={() => void onToggleRestriction(app._id, false)}
                            disabled={updatingAppId === app._id}
                            className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                            style={{
                              color: COLORS.generalText,
                              backgroundColor: `${COLORS.primary}18`,
                              border: `1px solid ${COLORS.primary}33`,
                            }}
                          >
                            {updatingAppId === app._id ? "Updating..." : "Unrestrict"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void onToggleRestriction(app._id, true)}
                            disabled={updatingAppId === app._id}
                            className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                            style={{
                              color: COLORS.white,
                              backgroundColor: COLORS.secondary,
                              border: `1px solid ${COLORS.secondary}`,
                            }}
                          >
                            {updatingAppId === app._id ? "Updating..." : "Restrict"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Box>
        )}

        {safeApps.length > ROWS_PER_PAGE && (
          <Box className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
              style={{
                color:
                  currentPage === 1
                    ? `${COLORS.generalText}80`
                    : COLORS.generalText,
                backgroundColor:
                  currentPage === 1
                    ? `${COLORS.border}80`
                    : `${COLORS.primary}12`,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              Previous
            </button>

            <Box className="flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === currentPage;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className="min-w-10 h-10 px-3 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? COLORS.white : COLORS.generalText,
                      backgroundColor: isActive ? COLORS.primary : COLORS.white,
                      border: `1px solid ${isActive ? COLORS.primary : COLORS.border}`,
                      boxShadow: isActive ? `0 6px 18px ${COLORS.primary}26` : "none",
                    }}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </Box>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
              style={{
                color:
                  currentPage === totalPages
                    ? `${COLORS.generalText}80`
                    : COLORS.white,
                backgroundColor:
                  currentPage === totalPages
                    ? `${COLORS.border}80`
                    : COLORS.primary,
                border: `1px solid ${
                  currentPage === totalPages ? COLORS.border : COLORS.primary
                }`,
              }}
            >
              Next
            </button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChildDetailsScreen;
