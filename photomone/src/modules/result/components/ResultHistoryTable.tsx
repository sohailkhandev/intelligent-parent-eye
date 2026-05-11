import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from "@mui/material";
import { useState } from "react";
import { MarketDetailsDialog } from "./MarketDetailsDialog";
import type { ExposureResult, ExposureResultsPagination } from "@types";
import { Loading } from "@components";
import { formatTime, translateMarketName } from "@utils";
import { useLanguage } from "@providers";
import { COLORS } from "@constants";

interface ResultHistoryTableProps {
  exposureResults?: ExposureResult[];
  loading?: boolean;
  pagination?: ExposureResultsPagination | null;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}
const BORDER_LIGHT = COLORS.border;
const MARKET_CYAN = "#00BCD4";

export const ResultHistoryTable = ({
  exposureResults = [],
  loading = false,
  pagination = null,
  page = 1,
  limit = 10,
  onPageChange,
}: ResultHistoryTableProps) => {
  const { translations } = useLanguage();
  const t = translations || {};
  const resultTranslations = t?.result || {};
  const historyTable = resultTranslations?.historyTable || {};
  const resultA11y = resultTranslations?.a11y || {};
  const [selectedResult, setSelectedResult] = useState<ExposureResult | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRowClick = (result: ExposureResult) => {
    setSelectedResult(result);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedResult(null);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    onPageChange?.(value);
  };

  const hasHistory = exposureResults && exposureResults.length > 0;
  const totalPages = pagination?.totalPages ?? 1;
  const showPagination = totalPages > 1 && !!onPageChange;
  const startIndex = (page - 1) * limit;

  const tableCellHeaderSx = {
    py: { xs: 1.5, sm: 2 },
    px: { xs: 1, sm: 2 },
    color: "#333",
    fontWeight: 700,
    fontSize: { xs: "0.75rem", sm: "0.875rem" },
    borderBottom: `1px solid ${BORDER_LIGHT}`,
  };

  const tableCellBodySx = {
    py: { xs: 1.5, sm: 2 },
    px: { xs: 1, sm: 2 },
    color: "#333",
    fontSize: { xs: "0.75rem", sm: "0.875rem" },
    borderBottom: `1px solid ${BORDER_LIGHT}`,
    backgroundColor: "#FFFFFF",
  };

  if (loading) {
    return (
      <Box
        className="rounded-2xl w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden"
        sx={{
          backgroundColor: "#FFFFFF",
          border: `1px solid ${BORDER_LIGHT}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Loading size={48} />
      </Box>
    );
  }

  if (!hasHistory) {
    return (
      <Box
        className="rounded-2xl p-4 w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden"
        sx={{
          backgroundColor: "#FFFFFF",
          border: `1px solid ${BORDER_LIGHT}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          sx={{ color: "#758599", fontSize: "1rem", fontWeight: 500 }}
          className="font-proxima"
        >
          {historyTable.noSalesYet || "No Sales Yet"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      className="w-full flex-1 min-h-0 overflow-hidden flex flex-col rounded-2xl"
      sx={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${BORDER_LIGHT}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <TableContainer
        className="overflow-auto w-[calc(100vw-40px)] lg:w-full"
        sx={{
          flex: 1,
          minHeight: 0,
          maxWidth: "100%",
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": { width: "8px", height: "8px" },
          "&::-webkit-scrollbar-track": {
            background: "#F5F5F5",
            borderRadius: 10,
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#E0E0E0",
            borderRadius: 10,
          },
        }}
      >
        <Table
          sx={{
            minWidth: { xs: 400 },
            tableLayout: { xs: "auto", sm: "fixed" },
          }}
        >
          <TableHead
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: "#FAFAFA",
              zIndex: 10,
              borderBottom: `1px solid ${BORDER_LIGHT}`,
            }}
          >
            <TableRow>
              <TableCell
                sx={{ ...tableCellHeaderSx, width: { xs: "10%", sm: "10%" } }}
              >
                {historyTable.serialNumber || "S. No"}
              </TableCell>
              <TableCell
                sx={{ ...tableCellHeaderSx, width: { xs: "10%", sm: "12%" } }}
                className="text-left"
              >
                {historyTable.photo || "Photo"}
              </TableCell>
              <TableCell
                sx={{ ...tableCellHeaderSx, width: { xs: "10%", sm: "12%" } }}
              >
                {historyTable.sales || "Sales"}
              </TableCell>
              <TableCell
                sx={{ ...tableCellHeaderSx, width: { xs: "25%", sm: "25%" } }}
              >
                {historyTable.market || "Market"}
              </TableCell>
              <TableCell
                sx={{ ...tableCellHeaderSx, width: { xs: "12%", sm: "25%" } }}
              >
                {historyTable.time || "Time"}
              </TableCell>
              <TableCell
                sx={{ ...tableCellHeaderSx, width: { xs: "8%", sm: "8%" } }}
              >
                {historyTable.earned || "Earned"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exposureResults.map((result, index) => (
              <TableRow
                key={result._id || index}
                onClick={() => handleRowClick(result)}
                sx={{
                  "&:hover": { backgroundColor: "rgba(0, 188, 212, 0.06)" },
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell sx={tableCellBodySx}>
                  {startIndex + index + 1}
                </TableCell>
                <TableCell
                  sx={{ ...tableCellBodySx, textAlign: "center" }}
                  className="text-left"
                >
                  <Box
                    component="img"
                    src={result.imageUrl || "https://via.placeholder.com/100"}
                    alt={
                      resultA11y.photoThumbnail ||
                      historyTable.photo ||
                      "Photo"
                    }
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "12px",
                      objectFit: "cover",
                      display: "block",
                      border: `1px solid ${COLORS.primary}`,
                    }}
                  />
                </TableCell>
                <TableCell sx={tableCellBodySx}>
                  <Typography
                    component="span"
                    sx={{
                      color: result.isSold ? COLORS.secondary : "#758599",
                      fontWeight: 500,
                      fontSize: "inherit",
                    }}
                  >
                    {result.isSold
                      ? historyTable.sold || "Sold"
                      : historyTable.unsold || "Unsold"}
                  </Typography>
                </TableCell>
                <TableCell sx={tableCellBodySx}>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      px: 1.5,
                      py: 1,
                      backgroundColor: COLORS.primary,
                      color: "#FFFFFF",
                      borderRadius: 20,
                      fontSize: { xs: "0.60rem", sm: "0.875rem" },
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {translateMarketName(result.marketName, translations) ||
                      result.marketName}
                  </Box>
                </TableCell>
                <TableCell sx={tableCellBodySx}>
                  <Box sx={{ display: { xs: "block", md: "none" } }}>
                    {formatTime(result.createdAt, true, translations)}
                  </Box>
                  <Box sx={{ display: { xs: "none", md: "block" } }}>
                    {formatTime(result.createdAt, false, translations)}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    ...tableCellBodySx,
                    fontWeight: 700,
                    color: COLORS.secondary,
                  }}
                >
                  {result.purchasePoints ?? 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showPagination && (
        <Box
          className="flex justify-center items-center pt-4 mt-auto"
          sx={{ borderTop: `1px solid ${BORDER_LIGHT}` }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#333",
                border: `1px solid ${BORDER_LIGHT}`,
                backgroundColor: "#FFFFFF",
                "&.Mui-selected": {
                  backgroundColor: MARKET_CYAN,
                  color: "#FFFFFF",
                  borderColor: MARKET_CYAN,
                  "&:hover": {
                    backgroundColor: MARKET_CYAN,
                    opacity: 0.9,
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(0, 188, 212, 0.08)",
                },
              },
              "& .MuiPaginationItem-icon": {
                color: "#758599",
              },
            }}
          />
        </Box>
      )}

      <MarketDetailsDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        exposureResult={selectedResult || null}
      />

    </Box>
  );
};
