import { MyProduct } from "./post";
import { MyTicket } from "./ticket";

export type MyRaffle = {
  id?: number;
  title?: string;
  startDate?: string;
  endDate?: string;
  price: number;
  maxQuantity?: number;
  quantityAvailable: number;
  product: MyProduct;
  tickets?: MyTicket[];
};
