import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@services";
import { ChildOverviewScreen } from "./ChildOverviewScreen";

export const ChildOverviewContainer = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["parentMe"],
    queryFn: () => AuthService.getMe(),
  });

  const children = data?.children ?? [];

  return (
    <ChildOverviewScreen children={children} isLoading={isLoading} />
  );
};
