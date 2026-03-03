import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ROUTES } from "@constants";
import { AuthLayout, DashboardLayout } from "@layouts";
import {
  AuthModule,
  HomeModule,
  ChildOverviewModule,
  AlertsModule,
  ControlsRestrictionsModule,
  SettingsModule,
} from "@modules";
import { ProtectedRoute } from "@components";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<AuthModule.LoginContainer />} />
        <Route path="register" element={<AuthModule.RegisterContainer />} />
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
        <Route path="alerts" element={<AlertsModule.AlertsContainer />} />
        <Route path="controls-restrictions" element={<ControlsRestrictionsModule.ControlsRestrictionsContainer />} />
        <Route path="settings" element={<SettingsModule.SettingsContainer />} />
      </Route>
    </Routes>
  );
}

export default App;
