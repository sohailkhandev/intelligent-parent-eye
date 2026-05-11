import { useQuery } from "@tanstack/react-query";
import { TicketService } from "@services";

export const useGetMyTickets = (marketNumber?: number) =>
  useQuery({
    queryKey: ["myTickets", marketNumber],
    queryFn: () => TicketService.getMyTickets(marketNumber),
    enabled: marketNumber != null,
  });

