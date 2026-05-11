import { ChildService } from "@services";
import { useMutation } from "@tanstack/react-query";

export const useDeleteChild = () =>
  useMutation({ mutationFn: ChildService.deleteChild });
