import React from 'react'
import { Box, BoxProps } from '@mui/material'

interface MainCardProps extends Omit<BoxProps, 'children'> {
  children: React.ReactNode
  className?: string
}

export const MainCard = ({ children, className = '', ...props }: MainCardProps) => {
  return (
    <Box
      className={`bg-[#0000000F] rounded-2xl md:rounded-2xl border border-[#0D9DFD]/20 py-5 px-4 md:p-8 w-full ${className}`}
      {...props}
    >
      {children}
    </Box>
  )
}

export default MainCard
