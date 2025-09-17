export type MyInvoice = {
  id: number;
  transactionId: string;
  transactionDate: string;
  total: number;
  currency: string;
  transactionStatus: string;
  tickets: {
    id: number;
    number?: number;
    code?: string;
    raffle?: {
      id: number;
      title: string;
      price: number;
      endDate: string;
    } | null;
  }[];
};
