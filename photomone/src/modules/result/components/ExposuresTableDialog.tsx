import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { MainDialog, Loading } from "@components";
import type { Exposure } from "@types";
import { translateMarketName } from "@utils";
import { useLanguage } from "@providers";
import { COLORS } from "@constants";

interface ExposuresTableDialogProps {
  open: boolean;
  onClose: () => void;
  exposures: Exposure[];
  loading?: boolean;
}

const BORDER_LIGHT = COLORS.border;

export const ExposuresTableDialog = ({
  open,
  onClose,
  exposures = [],
  loading = false,
}: ExposuresTableDialogProps) => {
  const { translations } = useLanguage();
  const t = translations || {};
  const resultTranslations = t?.result || {};
  const exposuresTable = resultTranslations?.exposuresTable || {};

  const getMarketName = (marketNumber: number): string => {
    const tpl = exposuresTable.marketWithNumber || "Market {number}";
    return tpl.replace("{number}", String(marketNumber));
  };

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

  return (
    <MainDialog
      open={open}
      onClose={onClose}
      title={exposuresTable.title || "Active Exposures"}
      maxWidth="md"
    >
      <Box
        className="rounded-2xl w-full overflow-hidden flex flex-col mt-6"
        sx={{
          backgroundColor: "#FFFFFF",
          border: `1px solid ${BORDER_LIGHT}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <TableContainer
          sx={{
            maxHeight: "calc(100vh - 300px)",
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
          <Table
            sx={{ width: "100%", tableLayout: { xs: "auto", sm: "fixed" } }}
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
                  {exposuresTable.serialNumber || "S. No"}
                </TableCell>
                <TableCell
                  sx={{ ...tableCellHeaderSx, width: { xs: "10%", sm: "12%" } }}
                  className="text-left"
                >
                  {exposuresTable.photo || "Photo"}
                </TableCell>
                <TableCell
                  sx={{ ...tableCellHeaderSx, width: { xs: "25%", sm: "25%" } }}
                >
                  {exposuresTable.market || "Market"}
                </TableCell>
                <TableCell
                  sx={{ ...tableCellHeaderSx, width: { xs: "15%", sm: "15%" } }}
                >
                  {exposuresTable.remainingExposures || "Remaining"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{
                      py: 6,
                      borderBottom: "none",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <Loading size={32} />
                  </TableCell>
                </TableRow>
              ) : exposures.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{
                      py: 6,
                      borderBottom: "none",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#758599",
                        fontSize: "1rem",
                        fontWeight: 500,
                      }}
                      className="font-proxima"
                    >
                      {exposuresTable.noData || "No data available"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                exposures.map((exposure, index) => {
                  const marketName = getMarketName(exposure.marketNumber);
                  const translatedMarketName = translateMarketName(
                    marketName,
                    t
                  );
                  const isLastRow = index === exposures.length - 1;

                  return (
                    <TableRow
                      key={exposure._id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(0, 188, 212, 0.06)",
                        },
                        cursor: "default",
                        transition: "background-color 0.2s",
                        "& td": {
                          borderBottom: isLastRow
                            ? "none"
                            : `1px solid ${BORDER_LIGHT}`,
                        },
                      }}
                    >
                      <TableCell sx={tableCellBodySx}>{index + 1}</TableCell>
                      <TableCell
                        sx={{ ...tableCellBodySx, textAlign: "center" }}
                        className="text-left"
                      >
                        <Box
                          component="img"
                          src={
                            exposure.imageUrl ||
                            "https://via.placeholder.com/100"
                          }
                          alt={
                            resultTranslations?.a11y?.photoThumbnail ||
                            exposuresTable.photo ||
                            "Photo"
                          }
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "12px",
                            objectFit: "cover",
                            display: "block",
                            margin: "0 auto",
                            border: `1px solid ${COLORS.primary}`,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={tableCellBodySx}>
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            px: 2,
                            py: 1,
                            backgroundColor: COLORS.primary,
                            color: "#FFFFFF",
                            borderRadius: 20,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {translatedMarketName}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          ...tableCellBodySx,
                          fontWeight: 700,
                          color: COLORS.generalText,
                        }}
                      >
                        {exposure.exposures}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </MainDialog>
  );
};
