interface AuthHeadingProps {
  text: string;
  className?: string;
}

export const AuthHeading = ({ text, className }: AuthHeadingProps) => {
  return (
    <h1
      className={`text-3xl lg:text-4xl font-bold text-white ${className || ""}`}
    >
      {text}
    </h1>
  );
};
