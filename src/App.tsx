import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ROUTES } from "@constants";
import { AuthLayout, DashboardLayout } from "@layouts";
import {
  AuthModule,
  HomeModule,
  ChildOverviewModule,
  AlertsModule,
  SettingsModule,
} from "@modules";
import { ProtectedRoute, SocketAlertHandler } from "@components";

function App() {
  return (
    <>
      <SocketAlertHandler />
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<AuthModule.LoginContainer />} />
          <Route path="register" element={<AuthModule.RegisterContainer />} />
          <Route path="verify-email" element={<AuthModule.VerifyEmailContainer />} />
          <Route
            path="verify-email/:token"
            element={<AuthModule.VerifyEmailContainer />}
          />
        </Route>
        <Route path="/parents" element={<AuthLayout />}>
          <Route
            path="verify-email"
            element={<AuthModule.VerifyEmailContainer />}
          />
          <Route
            path="verify-email/:token"
            element={<AuthModule.VerifyEmailContainer />}
          />
        </Route>
        <Route
          path={ROUTES.home}
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeModule.HomeContainer />} />
          <Route path="child-overview" element={<ChildOverviewModule.ChildOverviewContainer />} />
          <Route
            path="child-overview/:childId"
            element={<ChildOverviewModule.ChildDetailsContainer />}
          />
          <Route path="alerts" element={<AlertsModule.AlertsContainer />} />
          <Route path="settings" element={<SettingsModule.SettingsContainer />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
