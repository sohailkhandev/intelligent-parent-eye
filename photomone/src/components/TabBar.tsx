import { Box, Button } from "@mui/material";
import { COLORS } from "@constants";
import { LockCircleIcon } from "@assets/icons/svg";

const INACTIVE_BG = "#F9F9F9";
const INACTIVE_TEXT = "#758599";
const INACTIVE_HOVER_BG = "#EEEEEE";
const INACTIVE_HOVER_TEXT = "#5a6b7d";
const ACTIVE_HOVER_BG = "#f07d87"; // slightly darker secondary

interface Tab {
  label: string;
  value?: string | number;
  /** Icon node, or function that receives isActive to render icon with correct color */
  icon?: React.ReactNode | ((isActive: boolean) => React.ReactNode);
  /** When true, tab is not clickable and shows lock icon */
  disabled?: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: number;
  onTabChange: (index: number) => void;
  className?: string;
}

export const TabBar = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabBarProps) => {
  return (
    <Box
      className={`flex gap-2 sm:gap-4 rounded-lg overflow-y-hidden overflow-x-auto border border-[#E8E8E8] px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isActive = activeTab === idx;
        const isDisabled = tab.disabled === true;
        return (
          <Button
            key={tab.value ?? idx}
            onClick={() => !isDisabled && onTabChange(idx)}
            disableRipple
            disabled={isDisabled}
            startIcon={
              isDisabled ? (
                <LockCircleIcon width={18} height={18} color={INACTIVE_TEXT} />
              ) : typeof tab.icon === "function" ? (
                tab.icon(isActive)
              ) : (
                tab.icon
              )
            }
            className="flex-1 min-w-0 text-center font-semibold px-2 py-1.5 sm:p-2.5 lg:p-3 rounded-lg transition-all duration-300 border-none outline-none text-xs sm:text-sm lg:text-base truncate sm:whitespace-nowrap"
            sx={{
              color: isActive ? COLORS.white : `${INACTIVE_TEXT} !important`,
              backgroundColor: isActive ? COLORS.secondary : INACTIVE_BG,
              transition:
                "color 0.2s ease, background-color 0.2s ease, transform 0.15s ease",
              "& svg": { width: 18, height: 18 },
              "@media (min-width: 600px)": {
                "& svg": { width: 24, height: 24 },
              },
              "&:hover": !isDisabled
                ? {
                    color: isActive
                      ? COLORS.white
                      : `${INACTIVE_HOVER_TEXT} !important`,
                    backgroundColor: isActive
                      ? ACTIVE_HOVER_BG
                      : INACTIVE_HOVER_BG,
                    transform: "translateY(-1px)",
                  }
                : {},
              "&.Mui-disabled": {
                color: `${INACTIVE_TEXT} !important`,
                backgroundColor: INACTIVE_BG,
                cursor: "not-allowed",
                opacity: 0.9,
              },
            }}
          >
            {tab.label}
          </Button>
        );
      })}
    </Box>
  );
};

export default TabBar;
