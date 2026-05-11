import { Box } from "@mui/material";
import { Header, Footer } from "@layouts";
import { Outlet } from "react-router-dom";
import { COLORS } from "@constants";
import { ChatbotPopup } from "@components";

export const LandingLayout = () => {
  return (
    <Box
      className="min-h-screen flex flex-col overflow-x-hidden"
      sx={{ backgroundColor: COLORS.white }}
    >
      <Header />
      <Box component="main" className="flex-1 w-full mx-auto">
        <Outlet />
        <Footer className="pt-8 md:!pt-16" />
      </Box>

      {/* Chatbot Popup - bottom right */}
      <ChatbotPopup />
    </Box>
  );
};

export default LandingLayout;
