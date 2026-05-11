import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { Header } from "@layouts";
import { ChatbotPopup } from "@components";
import authBg from "@assets/images/authBg.jpg";

export const AuthLayout = () => {
  return (
    <Box
      className="min-h-screen"
      sx={{ backgroundImage: `url(${authBg})`, backgroundSize: "100% 100%" }}
    >
      <Header disableEntryAnimation />
      <Box className="container flex flex-col items-center justify-center px-4 py-30 mx-auto min-h-screen">
        <Outlet />
      </Box>
      <ChatbotPopup />
    </Box>
  );
};

export default AuthLayout;
