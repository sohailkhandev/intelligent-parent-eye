import { Box, Typography } from "@mui/material";
import { SecondaryText } from "@components";
import { COLORS } from "@constants";

interface StatCardProps {
  label: string;
  value: string;
  color: string;
  icon: React.ReactNode;
  tags?: string[];
}

export const StatCard = ({
  label,
  value,
  color,
  icon,
  tags,
}: StatCardProps) => {
  return (
    <Box
      className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 relative border border-white/10 backdrop-blur-sm"
      sx={{
        backgroundColor: COLORS.black,
      }}
    >
      <Box className="flex items-center gap-3">
        <Box
          className="lg:w-12 lg:h-12 w-10 h-10 rounded-lg flex items-center justify-center"
          sx={{
            backgroundColor: color,
          }}
        >
          {icon}
        </Box>

        <Box className="flex flex-col">
          <Typography
            className="font-proxima font-bold lg:text-2xl text-xl"
            sx={{ color }}
          >
            {value}
          </Typography>
          <SecondaryText title={label} />
        </Box>
      </Box>

      {/* Tags for streak card */}
      {tags && tags.length > 0 && (
        <Box className="flex flex-col text-center gap-2">
          {tags.map((tag, tagIdx) => (
            <span
              key={tagIdx}
              className="text-sm px-2 py-1 bg-[#0000004D] border border-[#0D9DFD]/20 rounded-md text-[#0D9DFD] font-medium font-proxima"
            >
              {tag}
            </span>
          ))}
        </Box>
      )}
    </Box>
  );
};
