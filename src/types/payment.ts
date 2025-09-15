// types/payment.ts
export type PaymentRequest = {
  paymentMethodNonce: string;
  tickets: number[]; // IDs de los tickets seleccionados
};

export type PaymentItem = {
  raffleId: number;
  raffleTitle: string;
  productTitle: string;
  tickets: number[]; // números de tickets comprados
  subtotal: number; // subtotal por rifa
};

export type PaymentResponse = {
  success: boolean;
  message: string;
  order?: {
    id: number;
    amount: number;
    currency: string;
    transactionId: string;
    transactionStatus: string;
    transactionDate: string;
    user: {
      id: number;
      username: string;
    };
    items: PaymentItem[];
  };
  error?: string;
};
