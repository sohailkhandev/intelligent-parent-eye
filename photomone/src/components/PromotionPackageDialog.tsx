import { Dialog, DialogContent, Box, Typography, IconButton } from "@mui/material";
import purchasePackageBannerBg from "@assets/images/purchasePackageBannerBg.jpg";
import purchasePackageBannerBgMobile from "@assets/images/purchasePackageBannerBgMobile.jpg";
import { CheckmarkIcon } from "@assets/icons/svg";
import { ROUTES } from "@constants";
import { useLanguage } from "@providers";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface PromotionPackageDialogProps {
  open: boolean;
  onClose: () => void;
  onPurchase?: () => void;
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PromotionPackageDialog = ({
  open,
  onClose,
}: PromotionPackageDialogProps) => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const t = translations || {};
  const promotionPackage = t.promotionPackage || {};
  const features = promotionPackage.features || {};

  const handleBuyClick = () => {
    navigate(`${ROUTES.shop}?pointsShop`);
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      className="z-[1400]"
      disableRestoreFocus
      PaperProps={{
        className: "!rounded-none !z-[1400] !bg-transparent !max-w-[1200px] !max-h-[90vh] !overflow-hidden !shadow-[0_20px_60px_rgba(0,0,0,0.5)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <DialogContent
        className="!p-0 !relative !py-[25px] min-h-[calc(100vh-100px)] flex items-center justify-center !px-4 !rounded-none !overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        sx={{
          backgroundImage: `url(${purchasePackageBannerBgMobile})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          '@media (min-width: 768px)': {
            backgroundImage: `url(${purchasePackageBannerBg})`,
            backgroundSize: "cover",
          },
        }}
      >
        <IconButton
          onClick={onClose}
          className="!absolute !top-2 !right-2 !text-white !bg-black/30 hover:!bg-black/50 !z-10 h-8 w-8"
        >
          <CloseIcon />
        </IconButton>

        <Box className="text-center flex flex-col items-center justify-center gap-2 md:gap-2">
          <Box className="bg-gradient-to-b from-[#0066FF] to-[#013B93] rounded-xl py-[10px] px-[1em] md:py-[10px] md:px-[1em] text-center border-2 border-[#00A289] inline-block max-w-[70%] md:max-w-[unset] mx-auto md:mx-0 md:mx-auto md:mx-0">
            <Typography className="text-white text-center text-[60%] md:text-sm font-bold leading-relax lg:leading-none tracking-[1px] uppercase font-['Montserrat',sans-serif]">
              {promotionPackage.firstPurchaseBanner || "FIRST PURCHASE BONUS &nbsp;+&nbsp; LIMITED-TIME OFFER"}
            </Typography>
          </Box>
          <Typography className="text-[150%] md:text-[4em] font-extrabold leading-[1.1] uppercase font-['Montserrat',sans-serif] bg-gradient-to-b from-[#FFF484] via-[#FFCE1F] to-[#FC9901] bg-clip-text text-transparent">
            {promotionPackage.getBonus || "GET 10,000 BONUS"}
          </Typography>
          <Box className="bg-gradient-to-b from-[#0066FF] to-[#013B93] rounded-2xl md:rounded-3xl py-[10px] px-[2em] md:py-[10px] md:px-[2em] text-center border-2 border-[#00A289] inline-block">
            <Typography className="text-white text-4xl md:text-7xl font-extrabold leading-none tracking-[1px] uppercase font-['Montserrat',sans-serif]">
              {promotionPackage.pointsInstantly || "POINTS INSTANTLY"}
            </Typography>
          </Box>
          <Typography className="text-white text-xs md:text-lg leading-none font-['Montserrat',sans-serif] mt-1 md:mt-2 px-4">
            {promotionPackage.description || "Purchase your first $10 package and receive a one-time reward of"}
          </Typography>
          <Typography className="text-sm md:text-lg font-extrabold leading-[1.1] uppercase font-['Montserrat',sans-serif] bg-gradient-to-b from-[#FFF484] via-[#FFCE1F] to-[#FC9901] bg-clip-text text-transparent mb-1 md:mb-2">
            {promotionPackage.bonusPoints || "10,000 BONUS POINTS"}
          </Typography>
          <Box className="border-t-2 border-b-2 border-[#FFCE1F] flex flex-wrap items-center text-left justify-start md:justify-center py-2 lg:px-4 gap-3 md:gap-6 w-full md:w-auto">
            {[
              features.firstPackage || "First $10 package",
              features.oneTimeBonus || "One-time bonus",
              features.instant || "Instantly added to your account",
            ].map((feature, index) => (
              <Box
                key={index}
                className="flex items-center gap-2 text-white text-sm md:text-lg font-thin font-['Montserrat',sans-serif]"
              >
                <CheckmarkIcon />
                <span>{feature}</span>
              </Box>
            ))}
          </Box>
          <Button onClick={handleBuyClick} className="bg-gradient-to-b from-[#0066FF] to-[#013B93] rounded-2xl md:rounded-full py-[10px] px-[1em] md:py-[10px] md:px-[1em] text-center border-2 border-[#00A289] inline-block leading-none text-white text-base md:text-xl font-bold uppercase tracking-[1px] font-['Montserrat',sans-serif] mt-2">
            {promotionPackage.buyButton || "Buy $10 Package"}
          </Button>
          <Typography className="text-xs md:text-lg font-extrabold leading-[1.1] uppercase font-['Montserrat',sans-serif] bg-gradient-to-b from-[#FFF484] via-[#FFCE1F] to-[#FC9901] bg-clip-text text-transparent mt-4 px-4">
            {promotionPackage.endDate || "ENDS FEB 20, 2026 - ONE-TIME OFFER ONLY"}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionPackageDialog;

