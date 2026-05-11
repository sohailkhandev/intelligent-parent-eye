import { Box } from "@mui/material";
import { DNA } from "react-loader-spinner";
import { COLORS } from "@constants";

interface LoadingProps {
  size?: number;
  fullScreen?: boolean;
  className?: string;
}

/**
 * Global centered loading spinner using DNA from react-loader-spinner.
 * Use everywhere a loading indicator is needed; always centered in its container.
 */
export const Loading = ({
  size = 48,
  fullScreen = false,
  className = "",
}: LoadingProps) => {
  const sizeStr = String(size);

  const spinner = (
    <DNA
      visible={true}
      height={sizeStr}
      width={sizeStr}
      ariaLabel="loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );

  const centeredWrapper = (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: size,
        minHeight: size,
      }}
      className={className}
    >
      {spinner}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          width: "100%",
          backgroundColor: COLORS.white,
        }}
      >
        {spinner}
      </Box>
    );
  }

  return centeredWrapper;
};

export default Loading;
