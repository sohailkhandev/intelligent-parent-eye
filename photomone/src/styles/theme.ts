import { createTheme } from '@mui/material/styles';

// Create a custom theme that works well with Tailwind
export const theme = createTheme({
  // Disable default MUI styles that conflict with Tailwind
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Remove default body styles to let Tailwind handle them
        body: {
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
      styleOverrides: {
        root: {
          // Allow Tailwind classes to override button styles
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent uppercase transformation
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          // Allow Tailwind to override typography
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove gradient overlay
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          background: 'transparent !important',
          backgroundColor: 'transparent !important',
          color: 'rgba(255, 255, 255, 0.8) !important',
          WebkitTextFillColor: 'currentColor !important',
          '&:link, &:visited, &:any-link, &:-webkit-any-link': {
            background: 'transparent !important',
            backgroundColor: 'transparent !important',
            color: 'rgba(255, 255, 255, 0.8) !important',
            WebkitTextFillColor: 'currentColor !important',
          },
          '&:hover, &:focus': {
            background: 'transparent !important',
            backgroundColor: 'transparent !important',
            WebkitTextFillColor: 'currentColor !important',
          },
          '&:active': {
            background: 'transparent !important',
            backgroundColor: 'transparent !important',
            WebkitTextFillColor: 'currentColor !important',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        container: {
          overflow: 'hidden',
        },
        scrollBody: {
          overflow: 'hidden',
        },
      },
    },
  },
  typography: {
    fontFamily: [
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#4f46e5', // Indigo-600 from Tailwind
      light: '#818cf8',
      dark: '#3730a3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6366f1',
      light: '#a5b4fc',
      dark: '#4338ca',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827', // Gray-900
      secondary: '#6b7280', // Gray-500
    },
  },
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,  // Match Tailwind's sm breakpoint
      md: 768,  // Match Tailwind's md breakpoint
      lg: 1024, // Match Tailwind's lg breakpoint
      xl: 1280, // Match Tailwind's xl breakpoint
    },
  },
});

