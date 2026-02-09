export type TicketStatus = {
  available: number;
  totalReleased: number;
  totalSold: number;
  maxCapacity: number;
  totalLimit: number;
  at: string;
};

export type LogEvent = {
  actorType: string;
  actorId: string;
  message: string;
  at: string;
};

export type SystemConfiguration = {
  id?: number;
  totalTickets: number;
  ticketReleaseRate: number;
  customerRetrievalRate: number;
  maxTicketCapacity: number;
};