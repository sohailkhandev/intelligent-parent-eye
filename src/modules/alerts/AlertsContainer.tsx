import { AlertsScreen } from "./AlertsScreen";
import { AlertsApis } from "@apis";

export const AlertsContainer = () => {
  const { data, isLoading } = AlertsApis.useGetAlerts();
  const alerts = data?.data.alerts ?? [];

  return <AlertsScreen alerts={alerts} isLoading={isLoading} />;
};
