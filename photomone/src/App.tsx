// april fools
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import "./index.css";
import { LandingLayout, AuthLayout, DashboardLayout } from "@layouts";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@styles";
import { AuthProvider, AppProvider, LanguageProvider } from "@providers";
import {
  Toast,
  ProtectedRoute,
  PublicRoute,
  ScrollToTop,
  GeoLanguageSync,
  SocketToastHandler,
  MarketSaleSuccessPopupGlobal,
  SellingReportDialogGlobal,
  MissionCompletedDialogGlobal,
} from "@components";
import { ROUTES } from "@constants";
import {
  LandingModule,
  HowItWorksModule,
  FaqModule,
  AboutUsModule,
  PrivacyPolicyModule,
  TermsAndConditionsModule,
  CustomerSupportModule,
  BlogModule,
  AuthModule,
  HomeModule,
  GiftShopModule,
  PhotomoneModule,
  ResultModule,
  ProfileModule,
  MarketModule,
} from "@modules";

function App() {
  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      event.preventDefault();
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <LanguageProvider>
        <AppProvider>
          <AuthProvider>
            <ScrollToTop />
            <GeoLanguageSync />
            <SocketToastHandler />
            <Routes>
              {/* Public Landing Routes */}
              <Route element={<LandingLayout />}>
                <Route
                  path={ROUTES.landing}
                  element={
                    <PublicRoute>
                      <LandingModule.LandingContainer />
                    </PublicRoute>
                  }
                />
                <Route
                  path={ROUTES.howItWorks}
                  element={<HowItWorksModule.HowItWorksContainer />}
                />
                <Route path={ROUTES.faq} element={<FaqModule.FaqContainer />} />
                <Route
                  path={ROUTES.aboutUs}
                  element={<AboutUsModule.AboutUsContainer />}
                />
                <Route
                  path={ROUTES.privacyPolicy}
                  element={<PrivacyPolicyModule.PrivacyPolicyContainer />}
                />
                <Route
                  path={ROUTES.termsAndConditions}
                  element={
                    <TermsAndConditionsModule.TermsAndConditionsContainer />
                  }
                />
                <Route
                  path={ROUTES.customerSupport}
                  element={<CustomerSupportModule.CustomerSupportContainer />}
                />
                <Route
                  path={ROUTES.blog}
                  element={<BlogModule.BlogIndexContainer />}
                />
                <Route
                  path="/blog/:slug"
                  element={<BlogModule.BlogPostContainer />}
                />
              </Route>

              {/* Auth Routes - Redirect to dashboard if already logged in */}
              <Route
                path="/auth"
                element={
                  <PublicRoute>
                    <AuthLayout />
                  </PublicRoute>
                }
              >
                <Route path="login" element={<AuthModule.LoginContainer />} />
                <Route
                  path="register"
                  element={<AuthModule.RegisterContainer />}
                />
                <Route
                  path="forgot-password"
                  element={<AuthModule.ForgotPasswordContainer />}
                />
                <Route
                  path="reset-password"
                  element={<AuthModule.ResetPasswordContainer />}
                />
              </Route>

              {/* Google Callback - Separate to handle OAuth */}
              <Route
                path="/auth/google/callback"
                element={<AuthModule.GoogleCallbackContainer />}
              />

              {/* Verify Email - Separate to handle email verification */}
              <Route path={ROUTES.verifyEmail} element={<AuthLayout />}>
                <Route index element={<AuthModule.VerifyEmailContainer />} />
              </Route>

              {/* Dashboard Routes - Protected, requires authentication */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<HomeModule.HomeContainer />} />
                {/* Handle /dashboard/dashboard redirect from Google OAuth */}
                <Route
                  path="dashboard"
                  element={<HomeModule.HomeContainer />}
                />
                <Route
                  path={ROUTES.shop}
                  element={<GiftShopModule.GiftShopContainer />}
                />
                <Route path={ROUTES.photomone}>
                  <Route
                    index
                    element={<PhotomoneModule.PhotomoneContainer />}
                  />
                  <Route
                    path="market"
                    element={<MarketModule.MarketContainer />}
                  />
                </Route>
                <Route
                  path={ROUTES.result}
                  element={<ResultModule.ResultContainer />}
                />
                <Route
                  path={ROUTES.profile}
                  element={<ProfileModule.ProfileContainer />}
                />
                <Route
                  path={ROUTES.notice}
                  element={<HomeModule.HomeContainer variant="notice" />}
                />
              </Route>
            </Routes>
            <Toast />
            <MarketSaleSuccessPopupGlobal />
            <SellingReportDialogGlobal />
            <MissionCompletedDialogGlobal />
          </AuthProvider>
        </AppProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
