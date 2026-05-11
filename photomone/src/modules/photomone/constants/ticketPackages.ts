export interface TicketPackage {
  id: string;
  name: string;
  tickets: number;
  price: number;
  description?: string;
}

export const ticketPackages: TicketPackage[] = [
  {
    id: "package-1",
    name: "Basic Package",
    tickets: 5,
    price: 10,
    description: "Perfect for getting started",
  },
  {
    id: "package-2",
    name: "Standard Package",
    tickets: 10,
    price: 20,
    description: "Great value for regular users",
  },
  {
    id: "package-3",
    name: "Premium Package",
    tickets: 20,
    price: 50,
    description: "Best value for active traders",
  },
  {
    id: "package-4",
    name: "Ultimate Package",
    tickets: 50,
    price: 100,
    description: "Maximum value for professionals",
  },
];
