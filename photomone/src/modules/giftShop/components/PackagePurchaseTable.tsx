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
import { Loading } from "@components";
import { useLanguage } from "@providers";
import { COLORS } from "@constants";
import { appLanguageToDateLocale } from "@utils";
import type { PackagePurchase, MyPackagesPagination } from "@types";

const BORDER_LIGHT = COLORS.border;
const MARKET_CYAN = "#00BCD4";

interface PackagePurchaseTableProps {
  purchases?: PackagePurchase[];
  loading?: boolean;
  pagination?: MyPackagesPagination | null;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export const PackagePurchaseTable = ({
  purchases = [],
  loading = false,
  pagination = null,
  page = 1,
  limit = 10,
  onPageChange,
}: PackagePurchaseTableProps) => {
  const { translations, language } = useLanguage();
  const t = translations || {};
  const shop = t.shop || {};
  const historyTable = shop.historyTable || {};
  const historyTime = shop.time || {};
  const packNames = shop.packNames || {};

  const formatHistoryTime = (date: Date | string | null | undefined): string => {
    if (!date) return historyTime.na || "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) return historyTime.justNow || "Just now";
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      const template =
        minutes === 1
          ? historyTime.minuteAgo || "{minutes} minute ago"
          : historyTime.minutesAgo || "{minutes} minutes ago";
      return template.replace("{minutes}", minutes.toString());
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      const template =
        hours === 1
          ? historyTime.hourAgo || "{hours} hour ago"
          : historyTime.hoursAgo || "{hours} hours ago";
      return template.replace("{hours}", hours.toString());
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      const template =
        days === 1
          ? historyTime.dayAgo || "{days} day ago"
          : historyTime.daysAgo || "{days} days ago";
      return template.replace("{days}", days.toString());
    }
    return dateObj.toLocaleDateString(appLanguageToDateLocale(language), {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    onPageChange?.(value);
  };

  const hasResults = purchases && purchases.length > 0;
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
          {historyTable.noPurchasesYet ?? "No purchases yet"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      className="w-full flex-1 min-h-0 flex flex-col rounded-2xl min-w-0 max-w-full overflow-hidden"
      sx={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${BORDER_LIGHT}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        overflowX: "auto",
      }}
    >
      <TableContainer
        className="overflow-auto w-[calc(100vw-40px)] lg:w-full"
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
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
            width: "100%",

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
              <TableCell sx={{ ...tableCellHeaderSx }}>
                {historyTable.serialNumber ?? "S. No"}
              </TableCell>
              <TableCell sx={{ ...tableCellHeaderSx }} className="text-left">
                {historyTable.packageName ?? "Package"}
              </TableCell>
              <TableCell sx={{ ...tableCellHeaderSx }}>
                {historyTable.purchasedAt ?? "Time"}
              </TableCell>
              <TableCell sx={{ ...tableCellHeaderSx }}>
                {historyTable.points ?? "Points"}
              </TableCell>
              <TableCell sx={{ ...tableCellHeaderSx }}>
                {historyTable.bonus ?? "Bonus"}
              </TableCell>
              <TableCell sx={{ ...tableCellHeaderSx }}>
                {historyTable.price ?? "Price"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((row, index) => (
              <TableRow
                key={row._id}
                sx={{
                  "&:hover": { backgroundColor: "rgba(0, 188, 212, 0.06)" },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell sx={tableCellBodySx}>
                  {startIndex + index + 1}
                </TableCell>
                <TableCell sx={tableCellBodySx} className="text-left">
                  {packNames[row.packageName] || row.packageName}
                </TableCell>
                <TableCell sx={tableCellBodySx}>
                  {formatHistoryTime(row.createdAt)}
                </TableCell>
                <TableCell sx={tableCellBodySx}>
                  {row.points.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    ...tableCellBodySx,
                    fontWeight: 700,
                    color: COLORS.secondary,
                  }}
                >
                  {row.bonus > 0 ? row.bonus.toLocaleString() : "—"}
                </TableCell>
                <TableCell sx={tableCellBodySx}>${row.price}</TableCell>
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
    </Box>
  );
};
