import { v2Axios } from "./index";

// 입고아이템 타입
export interface AdjustmentItem2 {
  id: number;
  created_by: number;
  created_time: Date;
  is_inactive: boolean;
  created_date: string;
  is_cleared: boolean;
  cleared_time: Date | null;
  rt_store_id: number;
  rt_store_name: string;
  ws_store_id: number;
  vendor_id: number;
  vendor_name: string;
  address: string;
  product_id: number;
  product_name: string;
  option: string;
  count: number;
  count_left: number;
  price: number;
  memo: string;
  is_vat_included: boolean;
  bank: string;
  account_number: string;
  account_holder: string;
  type: "reserve" | "takeback" | "exchange" | "refund";
}

export interface AdjustmentItem {
  rt_store_id: number;
  ws_store_id: number;
  vendor_id: number;
  product_id: number;
  adj_count: number;
  product_price: number;
  type: "reserve" | "takeback" | "exchange" | "balance" | "extra";
}

// Request: 정산아이템 조회
export interface RequestGetAdjustment {
  rt_store_id: number | undefined;
  last_id: number;
  offset: number;
  switch_type: "next" | "prev";
  start_date?: string;
  end_date?: string;
  type?: "reserve" | "takeback" | "exchange" | "refund";
  is_cleared?: number;
}

// Response: 정산장 조회
export interface ResponseGetAdjustment {
  msg: string;
  data: {
    data: Array<AdjustmentItem>;
    statistics: {
      cleared: {
        count: number;
        price: number;
      };
      not_cleared: {
        count: number;
        price: number;
      };
    };
  };
}

const getAdjustment = async function (query: RequestGetAdjustment) {
  let url = "adjustment/item?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetAdjustment>(url);
  return response.data;
};

export interface RequestCreateAdjustmentItem {
  item_list: Array<AdjustmentItem>;
}

export interface ResponseCreateAdjustmentItem {
  data: null;
}
const createAdjustmentItem = async function (data: RequestCreateAdjustmentItem) {
  const url = "adjustment/item";
  const response = await v2Axios.post<ResponseCreateAdjustmentItem>(url, data);
  return response.data;
};

const adjustmentAPI = {
  getAdjustment,
  createAdjustmentItem,
};

export default adjustmentAPI;
