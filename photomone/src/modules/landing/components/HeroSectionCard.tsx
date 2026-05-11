import { Box } from "@mui/material";

interface HeroSectionCardProps {
  img: string;
  alt?: string;
}

export const HeroSectionCard = ({ img, alt = "hero section card" }: HeroSectionCardProps) => {
  return (
    <Box
      className="border-2 lg:border-4 border-white rounded-xl lg:rounded-4xl p-1 pb-4 lg:p-3 lg:pb-10"
      sx={{
        backgroundImage:
          "radial-gradient(circle, #E8E8EC 0%, #F5F5F7 50%, #ffffff 100%)",
      }}
    >
      <img src={img} alt={alt} className="w-full h-full " />
    </Box>
  );
};

export default HeroSectionCard;
