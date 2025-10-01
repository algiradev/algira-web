import { MyProduct } from "./post";
import { MyTicket } from "./ticket";

export type MyRaffle = {
  id?: number;
  title?: string;
  startDate?: string;
  endDate?: string;
  price: number;
  maxQuantity?: number;
  availableAmount?: number;
  product: MyProduct;
  tickets?: MyTicket[];
  isDrawn?: boolean;
};
