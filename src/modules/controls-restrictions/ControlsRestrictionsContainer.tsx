import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@services";
import { ControlsRestrictionsScreen } from "./ControlsRestrictionsScreen";

export const ControlsRestrictionsContainer = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["parentMe"],
    queryFn: () => AuthService.getMe(),
  });

  const children = data?.children ?? [];

  return (
    <ControlsRestrictionsScreen
      children={children}
      isLoading={isLoading}
    />
  );
};
