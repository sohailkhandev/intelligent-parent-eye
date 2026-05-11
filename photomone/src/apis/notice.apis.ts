import { useQuery } from "@tanstack/react-query";
import { NoticeService } from "@services";

export const useGetNotices = () =>
  useQuery({
    queryKey: ["notices"],
    queryFn: NoticeService.getNotices,
  });
