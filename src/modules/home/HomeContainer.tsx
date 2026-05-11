import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChildApis } from "@apis";
import { AuthService } from "@services";
import { HomeScreen } from "./HomeScreen";

export const HomeContainer = () => {
  const queryClient = useQueryClient();
  const [deletingChildId, setDeletingChildId] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["parentMe"],
    queryFn: () => AuthService.getMe(),
  });
  const { mutateAsync: deleteChild } = ChildApis.useDeleteChild();

  const parent = data?.parent ?? null;
  const children = data?.children ?? [];

  const handleDeleteChild = async (childId: string, _childName: string) => {

    try {
      setDeletingChildId(childId);
      await deleteChild(childId);

      queryClient.setQueryData(
        ["parentMe"],
        (
          previous:
            | { parent: typeof parent; children: typeof children }
            | undefined
        ) =>
          previous
            ? {
                ...previous,
                children: previous.children.filter((child) => child._id !== childId),
              }
            : previous,
      );

      void queryClient.invalidateQueries({ queryKey: ["parentMe"] });
    } finally {
      setDeletingChildId(null);
    }
  };

  return (
    <HomeScreen
      parent={parent}
      children={children}
      deletingChildId={deletingChildId}
      isTableLoading={isLoading || isFetching}
      onDeleteChild={handleDeleteChild}
    />
  );
};
