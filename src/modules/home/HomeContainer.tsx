import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@services";
import { HomeScreen } from "./HomeScreen";

export const HomeContainer = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["parentMe"],
    queryFn: () => AuthService.getMe(),
  });

  const parent = data?.parent ?? null;
  const children = data?.children ?? [];

  return (
    <HomeScreen
      parent={parent}
      children={children}
      isLoading={isLoading}
    />
  );
};
