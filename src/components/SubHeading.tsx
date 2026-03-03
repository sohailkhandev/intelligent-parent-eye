import { COLORS } from "@constants";

interface SubHeadingProps {
  title: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SubHeading = ({ title, className, style }: SubHeadingProps) => {
  return (
    <h2
      className={`text-lg font-semibold tracking-tight ${className ?? ""}`}
      style={{ color: COLORS.generalText, ...style }}
    >
      {title}
    </h2>
  );
};

export default SubHeading;
