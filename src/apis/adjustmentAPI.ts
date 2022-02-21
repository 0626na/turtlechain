import { v2Axios } from "./index";
import { VendorInfo, ProductInfo } from "./warehousingAPI";


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
  vendor_id: number;
  product_id: number;
  count: number;
  price: number;
  is_cleared: number;
  type: "reserve" | "takeback" | "exchange" | "balance" ;
}

// Request: 정산아이템 조회
export interface RequestGetAdjustmentList {
  rt_store_id: number | undefined;
  page: number;
  start_date?: string;
  end_date?: string;
  is_cleared?: number;
}

// Response: 정산장 조회
export interface ResponseGetAdjustmentList {
  msg: string;
  data: {
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
    total_count:number;
    adjustment_list:Array<AdjustmentItem>;
  };
}

const getAdjustmentList = async function (query: RequestGetAdjustmentList) {
  let url = "adjustment/item?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetAdjustmentList>(url);
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




export interface adjustmentItemResponse {
  id: number;
  is_inactive: boolean;
  created_date: string;
  cleared_time: string | null;
  rt_store_id: number;
  ws_store_id: number;
  vendor_info: VendorInfo,
  product_info: ProductInfo,
  count: number;
  count_left: number;
  price: number;
  is_vat_included: boolean;
  type: "reserve" | "takeback" | "exchange" | "refund";
  memo: string;
}


// Request: 정산아이템 조회
export interface RequestGetAdjustmentForClearing {
  rt_store_id: number | undefined;
  start_date?: string;
  end_date?: string;
  type?: "reserve" | "takeback" | "exchange" | "refund";
  is_cleared?: number;
}

// Response: 정산장 조회
export interface ResponseGetAdjustmentForClearing {
  msg: string;
  data: {
    adjustment_list: Array<adjustmentItemResponse>;
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

const getAdjustmentForClearing = async function (query: RequestGetAdjustmentForClearing) {
  let url = "adjustment/item?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetAdjustmentForClearing>(url);
  return response.data;
};

const adjustmentAPI = {
  getAdjustmentList,
  createAdjustmentItem,
  getAdjustmentForClearing
};

export default adjustmentAPI;
