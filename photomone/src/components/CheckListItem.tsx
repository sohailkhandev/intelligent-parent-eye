import { Box } from "@mui/material";
import { COLORS } from "@constants";
import { ThemeText } from "./ThemeText";
import { CheckIcon } from "@assets/icons/svg";

export interface CheckListItemProps {
  /** Single line of text (rendered with ThemeText). Omit when using children. */
  text?: string;
  /** Custom content instead of text (e.g. multiple lines or nested content). */
  children?: React.ReactNode;
  /** Root element (default "li" for use inside ul). */
  component?: React.ElementType;
  className?: string;
}

export const CheckListItem = ({
  text,
  children,
  component = "li",
  className = "",
}: CheckListItemProps) => (
  <Box
    component={component}
    className={`flex items-start gap-3 ${className}`.trim()}
  >
    <Box
      className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
      sx={{
        backgroundColor: COLORS.secondary,
        color: COLORS.white,
        marginTop: "0.16rem",
      }}
    >
      <CheckIcon />
    </Box>
    {children !== undefined ? children : <ThemeText text={text ?? ""} />}
  </Box>
);

export default CheckListItem;
