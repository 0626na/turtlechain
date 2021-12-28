import { v2Axios } from "apis";

// 주문 등록 추가 타입
export interface CreateOrderItem {
  store_name: string;
  address: string;
  phone: string;
  product_code: string;
  product_name: string;
  option: string;
  price: number;
  order_count: number;
  order_type: string;
  memo: string;
}

const orderAPI = {};

export default orderAPI;
