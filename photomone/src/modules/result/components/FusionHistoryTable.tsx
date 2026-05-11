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
import { Lock } from "@mui/icons-material";
import { useState } from "react";
import { FusionDetailDialog } from "./FusionDetailDialog";
import type { FusionResult, FusionResultsPagination } from "@types";
import { Loading } from "@components";
import { useLanguage } from "@providers";
import { formatTime } from "@utils";
import { COLORS } from "@constants";

interface FusionHistoryTableProps {
  fusionResults?: FusionResult[];
  loading?: boolean;
  pagination?: FusionResultsPagination | null;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}
const BORDER_LIGHT = COLORS.border;
const MARKET_CYAN = "#00BCD4";

export const FusionHistoryTable = ({
  fusionResults = [],
  loading = false,
  pagination = null,
  page = 1,
  limit = 10,
  onPageChange,
}: FusionHistoryTableProps) => {
  const { translations } = useLanguage();
  const t = translations || {};
  const resultTranslations = t?.result || {};
  const historyTable = resultTranslations?.historyTable || {};
  const resultA11y = resultTranslations?.a11y || {};
  const fusionTable = resultTranslations?.fusionTable || {};
  const [selectedResult, setSelectedResult] = useState<FusionResult | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRowClick = (result: FusionResult) => {
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

  const hasResults = fusionResults && fusionResults.length > 0;
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

  if (!hasResults) {
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
          {fusionTable.noFusionsYet ?? "No fusions yet"}
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
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          width: "100%",
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
        <Table sx={{ width: "100%", tableLayout: { xs: "auto", sm: "fixed" } }}>
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
              <TableCell sx={{ ...tableCellHeaderSx }}>
                {historyTable.serialNumber || "S. No"}
              </TableCell>
              <TableCell sx={{ ...tableCellHeaderSx }} className="text-left">
                {historyTable.photo || "Photo"}
              </TableCell>
              <TableCell sx={{ ...tableCellHeaderSx }}>
                {fusionTable.score ?? "Score"}
              </TableCell>
              <TableCell sx={{ ...tableCellHeaderSx }}>
                {fusionTable.fusedAt ?? "Fused at"}
              </TableCell>
              <TableCell
                sx={{
                  ...tableCellHeaderSx,

                  whiteSpace: "nowrap",
                }}
              >
                {fusionTable.luckyEarned ?? "Locky earned"}
              </TableCell>
              <TableCell sx={{ ...tableCellHeaderSx }}>
                {fusionTable.points ?? "Points"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fusionResults.map((result, index) => (
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
                    alt={resultA11y.fusionThumbnail || "Fusion"}
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
                <TableCell
                  sx={{
                    ...tableCellBodySx,
                    fontWeight: 600,
                    color:
                      (result.score ?? 0) < 100
                        ? COLORS.secondary
                        : COLORS.primary,
                  }}
                >
                  {result.score ?? 0}
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
                    color: "#F9A602",
                    fontWeight: 600,
                  }}
                >
                  1
                </TableCell>
                <TableCell
                  sx={{
                    ...tableCellBodySx,
                    fontWeight: 700,
                    color: COLORS.secondary,
                  }}
                >
                  {result.points == null ? (
                    <Lock
                      sx={{
                        fontSize: 20,
                        color: COLORS.grayStrong,
                        verticalAlign: "middle",
                      }}
                    />
                  ) : (
                    result.points
                  )}
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

      <FusionDetailDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fusionResult={selectedResult}
      />
    </Box>
  );
};
