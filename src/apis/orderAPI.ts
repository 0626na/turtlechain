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
  id: number;
  status: string;
  created_date: string;
  order_case_count: number;
  reserve_case_count: number;
  takeback_case_count: number;
  exchange_case_count: number;
  sample_case_count: number;
  pickup_case_count: number;
  extra_case_count: number;
  order_count: number;
  reserve_count: number;
  takeback_count: number;
  exchange_count: number;
  sample_count: number;
  pickup_count: number;
  extra_count: number;
  kakao: number;
  sms: number;
  fail: number;
}

export interface OrderItem {
  id: number;
  product_info: {
    vendor_info: {
      vendor_name: string;
      vendor_address: string;
    };
    product_code: string;
    name: string;
    vendor_product_name: string;
    price: string;
    option: string;
    memo: string;
    image_url: string;
  };
  count: number;
  price: number;
  type: string;
  memo: string;
  image_url: string;
}

export interface RequestGetList {
  rt_store_id: number;
  start_date: string;
  end_date: string;
}

export interface ResponseGetList {
  msg: string;
  data: {
    order_sheet_list: Array<OrderSheet>;
    total_count: number;
  };
}

const getList = async function (query: RequestGetList) {
  let url = `order/sheet?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetList>(url);
  return response.data;
};

export interface RequestGet {
  order_sheet_id: number;
}

export interface ResponseGet {
  msg: string;
  data: OrderSheet;
}

const get = async function (query: RequestGet) {
  const url = `order/sheet/${query.order_sheet_id}`;
  const response = await v2Axios.get<ResponseGet>(url);
  return response.data;
};

export interface RequestGetItem {
  sheet_id: number;
}

export interface ResponseGetItem {
  msg: string;
  data: {
    order_item_list: Array<OrderItem>;
    total_count: number;
  };
}

const getItem = async function (query: RequestGetItem) {
  let url = `order/item?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetItem>(url);
  return response.data;
};

const orderAPI = {
  getList,
  get,
  getItem,
};

export default orderAPI;
