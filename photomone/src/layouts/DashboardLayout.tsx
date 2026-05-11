import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { COLORS } from "@constants";
import { AppHeader } from "./AppHeader";
import { Sidebar } from "./Sidebar";
import { BottomNavigation } from "./BottomNavigation";
import { ChatbotPopup } from "@components";
import { useAuthContext } from "@providers";
import { ROUTES } from "@constants";
import dashboardBg from "@assets/images/dashboardBg.png";
// import { PromotionPackageDialog, PromotionSocialDialog } from "@components";
// import { useAppContext } from "@providers";

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { refreshUser } = useAuthContext();
  const location = useLocation();

  // Refresh user when visiting any dashboard screen
  useEffect(() => {
    refreshUser();
  }, [location.pathname, refreshUser]);

  // const { promotionPackageDialog, promotionSocialDialog } = useAppContext();
  // const { authUser } = useAuthContext();
  // const hasShownPromotionOnLogin = useRef(false);

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  // const handlePurchase = () => {
  //   // Handle purchase logic here
  //   console.log("Purchase package clicked");
  //   promotionPackageDialog.hide();
  // };

  // Show random promotion dialog when user logs in with profileCompleted = true
  // useEffect(() => {
  //   if (authUser?.profileCompleted && !hasShownPromotionOnLogin.current && authUser?._id) {
  //     // Randomly pick one of the two promotion dialogs
  //     const randomDialog = Math.random() < 0.5 ? 'package' : 'social';

  //     // Delay showing the dialog a bit to ensure smooth UX (like ads)
  //     const timer = setTimeout(() => {
  //       if (randomDialog === 'package') {
  //         promotionPackageDialog.show();
  //       } else {
  //         promotionSocialDialog.show();
  //       }
  //       hasShownPromotionOnLogin.current = true;
  //     }, 2000); // Show after 2 seconds

  //     return () => clearTimeout(timer);
  //   }
  // }, [authUser?.profileCompleted, authUser?._id, promotionPackageDialog, promotionSocialDialog]);

  // Reset the flag when user changes (logout/login)
  // useEffect(() => {
  //   if (!authUser?._id) {
  //     hasShownPromotionOnLogin.current = false;
  //   }
  // }, [authUser?._id]);

  return (
    <Box className="flex min-h-screen" sx={{ backgroundColor: COLORS.white }}>
      {/* Sidebar - Fixed */}
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />

      {/* Main Content Area */}
      <Box className="flex-1 flex flex-col min-h-screen lg:ml-[300px]">
        {/* Header - Fixed */}
        <Box className="fixed top-0 right-0 left-0 lg:left-[300px] z-40">
          <AppHeader />
        </Box>

        {/* Content - with top padding for fixed header; overflow-x containment so tables don't break the screen */}
        <Box
          component="main"
          className="flex-1 min-w-0 overflow-x-hidden px-4 lg:px-8 pt-20 lg:pt-26 pb-19 lg:pb-0"
          sx={{
            backgroundImage: `url(${dashboardBg})`,
            backgroundSize: "100% 100%",
            backgroundPosition: "bottom",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Box className="max-w-7xl mx-auto w-full min-w-0 overflow-x-hidden">
            <Outlet />
          </Box>
        </Box>
      </Box>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNavigation />

      {/* Promotion Package Dialog */}
      {/* <PromotionPackageDialog
        open={promotionPackageDialog.open}
        onClose={promotionPackageDialog.hide}
        onPurchase={handlePurchase}
      /> */}

      {/* Promotion Social Dialog */}
      {/* <PromotionSocialDialog
        open={promotionSocialDialog.open}
        onClose={promotionSocialDialog.hide}
      /> */}

      {/* Chatbot Popup - only on profile screen */}
      {location.pathname === `${ROUTES.dashboard}/${ROUTES.profile}` && <ChatbotPopup />}
    </Box>
  );
};

export default DashboardLayout;
