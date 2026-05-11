import { Dialog, DialogContent, Box, Typography, IconButton } from "@mui/material";
import socialBannerBg from "@assets/images/socialBanner.jpg";
import socialBannerBgMobile from "@assets/images/socialBannerMobile.jpg";
import { Button } from "@mui/material";
import { useAppContext, useLanguage } from "@providers";

interface PromotionSocialDialogProps {
  open: boolean;
  onClose: () => void;
  onCopyText?: () => void;
  onEmailLink?: () => void;
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DiamondIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0L12 6L6 12L0 6L6 0Z" fill="white"/>
  </svg>
);

export const PromotionSocialDialog = ({
  open,
  onClose,
  onCopyText,
  onEmailLink,
}: PromotionSocialDialogProps) => {
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  
  const t = translations || {};
  const promotionSocial = t.promotionSocial || {};
  const steps = promotionSocial.steps || {};

  const handleCopyText = async () => {
    const textToCopy = `${promotionSocial.hashtagOfficial || "#PhotoMoneOfficial"} ${promotionSocial.hashtagReward || "#PhotoMoneReward"}\n${promotionSocial.joinMeNow || "Join me now!"}`;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast(promotionSocial.textCopied || "Text copied to clipboard!", "success");
      if (onCopyText) {
        onCopyText();
      }
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        showToast(promotionSocial.textCopied || "Text copied to clipboard!", "success");
        if (onCopyText) {
          onCopyText();
        }
      } catch (fallbackErr) {
        showToast(promotionSocial.failedToCopy || "Failed to copy text", "error");
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const handleEmailLink = () => {
    if (onEmailLink) {
      onEmailLink();
    }
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
          backgroundImage: `url(${socialBannerBgMobile})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          '@media (min-width: 768px)': {
            backgroundImage: `url(${socialBannerBg})`,
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

        <Box className="text-center flex flex-col items-center justify-center gap-2 md:gap-2 w-full">
            <Typography className="text-white text-2xl md:text-5xl font-bold leading-[1.1] font-['Montserrat',sans-serif]">
                {promotionSocial.turnYourSelfie || "Turn Your Selfie"}
            </Typography>
            <Box className="bg-gradient-to-b from-[#0066FF] to-[#013B93] rounded-2xl md:rounded-3xl py-[10px] px-[2em] md:py-[10px] md:px-[2em] text-center border-2 border-[#00A289] inline-block">
                <Typography className="text-white text-4xl md:text-6xl font-extrabold leading-none tracking-[1px] uppercase font-['Montserrat',sans-serif]">
                    {promotionSocial.intoMoney || "INTO MONEY"}
                </Typography>
            </Box>
            <Typography className="text-white text-xs md:text-base leading-none font-['Montserrat',sans-serif] mt-1 md:mt-2 px-4">
                {promotionSocial.description || "Post PhotoMone on TikTok, Instagram, or Facebook and earn"}
            </Typography>
            <Typography className="text-sm md:text-lg font-extrabold leading-[1.1] uppercase font-['Montserrat',sans-serif] bg-gradient-to-b from-[#FFF484] via-[#FFCE1F] to-[#FC9901] bg-clip-text text-transparent mb-1 md:mb-2">
                {promotionSocial.bonusPoints || "5,000 BONUS POINTS"}
            </Typography>
            <Box className="border-2 border-dashed border-white rounded-2xl px-4 py-2 md:px-6 flex items-center justify-between flex-wrap md:gap-4 w-full max-w-[90%] md:max-w-[600px]">
              <Typography className="text-white text-sm md:text-base  font-['Montserrat',sans-serif]">
                {promotionSocial.hashtagOfficial || "#PhotoMoneOfficial"}
              </Typography>
              <Typography className="text-white text-sm md:text-base  font-['Montserrat',sans-serif]">
                {promotionSocial.hashtagReward || "#PhotoMoneReward"}
              </Typography>
              <Typography className="text-white text-sm md:text-base font-normal font-['Montserrat',sans-serif]">
                {promotionSocial.joinMeNow || "Join me now!"}
              </Typography>
            </Box>
            <Box className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-8 mt-2">
              <Button 
                  onClick={handleCopyText} 
                  className="bg-gradient-to-b from-[#0066FF] to-[#013B93] rounded-2xl md:rounded-full py-[10px] px-[1em] md:py-[10px] md:px-[1em] text-center border-2 border-[#00A289] inline-block leading-none text-white text-base md:text-xl font-bold uppercase tracking-[1px] font-['Montserrat',sans-serif]"
              >
                  {promotionSocial.copyText || "COPY TEXT"}
              </Button>
              <Button 
                  onClick={handleEmailLink} 
                  className="bg-gradient-to-b from-[#0066FF] to-[#013B93] rounded-2xl md:rounded-full py-[10px] px-[1em] md:py-[10px] md:px-[1em] text-center border-2 border-[#00A289] inline-block leading-none text-white text-base md:text-xl font-bold uppercase tracking-[1px] font-['Montserrat',sans-serif]"
              >
                  {promotionSocial.emailYourLink || "EMAIL YOUR LINK"}
              </Button>
            </Box>
            <Box className="flex flex-col items-center justify-center mt-1 md:mt-4 w-full max-w-[90%] md:max-w-[800px]">
                <Box className="flex items-center justify-center gap-2 mb-2">
                    <DiamondIcon />
                    <Typography className="text-sm md:text-lg font-extrabold leading-[1.1] uppercase font-['Montserrat',sans-serif] bg-gradient-to-b from-[#FFF484] via-[#FFCE1F] to-[#FC9901] bg-clip-text text-transparent">
                        {promotionSocial.howToParticipate || "HOW TO PARTICIPATE"}
                    </Typography>
                    <DiamondIcon />
                </Box>
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 w-full">
                    <Box className="flex items-start gap-2">
                        <Box className="mt-1">
                            <DiamondIcon />
                        </Box>
                        <Typography className="text-white text-xs md:text-base font-normal font-['Montserrat',sans-serif] text-left">
                            {steps.takeSelfie || "Take a PhotoMone selfie."}
                        </Typography>
                    </Box>
                    <Box className="flex items-start gap-2">
                        <Box className="mt-1">
                            <DiamondIcon />
                        </Box>
                        <Typography className="text-white text-xs md:text-base font-normal font-['Montserrat',sans-serif] text-left">
                            {steps.postSocial || "Post on your social media platform."}
                        </Typography>
                    </Box>
                    <Box className="flex items-start gap-2">
                        <Box className="mt-1">
                            <DiamondIcon />
                        </Box>
                        <Typography className="text-white text-xs md:text-base font-normal font-['Montserrat',sans-serif] text-left">
                            {steps.copyTextAddLink || "Copy required text + add link."}
                        </Typography>
                    </Box>
                    <Box className="flex items-start gap-2">
                        <Box className="mt-1">
                            <DiamondIcon />
                        </Box>
                        <Typography className="text-white text-xs md:text-base font-normal font-['Montserrat',sans-serif] text-left">
                            {steps.submitLink || "Submit link + receive 5,000 points."}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Typography className="text-xs md:text-lg font-extrabold leading-[1.1] uppercase font-['Montserrat',sans-serif] bg-gradient-to-b from-[#FFF484] via-[#FFCE1F] to-[#FC9901] bg-clip-text text-transparent px-4">
                {promotionSocial.endDate || "ENDS FEB 20, 2026"}
            </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionSocialDialog;

