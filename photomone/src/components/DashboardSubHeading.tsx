import { Typography, Box, Tooltip, ClickAwayListener } from '@mui/material'
import { QuestionMarkIcon } from '@assets/icons/svg'
import { useState } from 'react'
import { COLORS } from '@constants'

interface DashboardSubHeadingProps {
  title: string | React.ReactNode
  className?: string
  tooltip?: string
}

export const DashboardSubHeading = ({ title, className = '', tooltip, ...props }: DashboardSubHeadingProps) => {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipToggle = () => {
    setOpen(!open);
  };

  return (
    <Box className={`flex items-center gap-2 ${className}`}>
      <Typography
        variant="h5"
        component="h5"
        className="text-base lg:text-lg font-semibold"
        sx={{ color: COLORS.generalText }}
        {...props}
      >
        {title}
      </Typography>
      {tooltip && (
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <Box>
            <Tooltip 
              title={tooltip}
              arrow
              placement="top"
              open={open}
              onClose={handleTooltipClose}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'rgba(13, 157, 253, 0.95)',
                    color: 'white',
                    fontSize: '0.875rem',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    maxWidth: '320px',
                    fontFamily: 'Inter, sans-serif',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    '& .MuiTooltip-arrow': {
                      color: 'rgba(13, 157, 253, 0.95)',
                    },
                  },
                },
              }}
            >
              <Box 
                onClick={handleTooltipToggle}
                className="text-white/60 hover:text-[#0D9DFD] active:text-[#0D9DFD] transition-colors cursor-pointer flex items-center justify-center w-5 h-5"
              >
                <QuestionMarkIcon />
              </Box>
            </Tooltip>
          </Box>
        </ClickAwayListener>
      )}
    </Box>
  )
}

export default DashboardSubHeading

