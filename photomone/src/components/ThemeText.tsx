interface ThemeTextProps {
  text: string | React.ReactNode;
  className?: string;
}

export const ThemeText = ({ text, className = "" }: ThemeTextProps) => {
  return (
    <p className={`text-sm lg:text-[17px] font-medium ${className}`}>{text}</p>
  );
};

export default ThemeText;
