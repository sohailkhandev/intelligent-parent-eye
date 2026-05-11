import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@services";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants";
import { ChildOverviewScreen } from "./ChildOverviewScreen";

export const ChildOverviewContainer = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["parentMe"],
    queryFn: () => AuthService.getMe(),
  });

  const children = data?.children ?? [];

  return (
    <ChildOverviewScreen
      children={children}
      isLoading={isLoading}
      onChildSelect={(childId) => navigate(`${ROUTES.childOverview}/${childId}`)}
    />
  );
};
