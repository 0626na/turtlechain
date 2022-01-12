import { v2Axios } from "apis";

// 주문 등록 추가 타입
export interface CreateOrderItem {
  vendor_name: string;
  vendor_address: string;
  vendor_phone: string;
  product_code: number;
  product_name: string;
  product_option: string;
  product_price: number;
  product_count: number;
  order_type: string;
  order_memo: string;
}

// 주문서 타입
export interface OrderSheet {
  order_status: string;
  order_time: Date;
  order_content: string;
  order_sheet_status: string;
}

// 상품 검색 response 타입
export interface responseGetProduct {
  product_code: number;
  product_name: string;
  product_option: string;
  product_price: number;
}

const orderAPI = {};

export default orderAPI;
