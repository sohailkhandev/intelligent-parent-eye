import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "@assets/images/logo.png";
import { COLORS } from "@constants";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen auth-page-background">
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center w-full px-6 lg:px-16 py-4"
        style={{
          background: COLORS.white,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <img src={logo} alt="Logo" className="h-[70px]" />
      </header>

      <main className="pt-30 pb-12">
        <Outlet />
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};
