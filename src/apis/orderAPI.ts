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

export interface RequestGetOrderList {
  rt_store_id: number;
  start_date: string;
  end_date: string;
}

export interface ResponseGetOrderList {}

const getOrderList = async function (query: RequestGetOrderList) {
  let url = `order/sheet?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get(url);
  return response.data;
};

const orderAPI = {
  getOrderList,
};

export default orderAPI;
