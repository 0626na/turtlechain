import { v2Axios } from "./index";
import { ResponseUpdate } from "./retailerStoreAPI";
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

export interface AdjustmentProduct {
  index: number;

  vendor_id: number;
  vendor_name: string;
  vendor_address: string;

  product_id: number;
  product_name: string;
  vendor_product_name: string;
  product_option: string;
  product_price: number;
  product_count: number;
  product_code: number;

  type: "reserve" | "takeback" | "exchange" | "refund";
  memo?: string | undefined;

  // 수정필요
  id?: number;
  is_cleared?: boolean;
  created_date?: string;
  is_vat_included?: boolean;
  vendor_info?: {
    vendor_name: string;
  };
  product_info?: {
    name: string;
    vendor_product_name: string;
  };
  price?: number;
}

// Request: 정산아이템 조회
export interface RequestGetAdjustmentList {
  rt_store_id: number | undefined;
  page: number;
  start_date?: string;
  end_date?: string;
  is_cleared?: number | "";
  type: "reserve" | "takeback" | "exchange" | "balance" | "all";
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
    total_count: number;
    adjustment_list: Array<AdjustmentProduct>;
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

export interface RequestCreate {
  item_list: Array<{
    rt_store_id: number;
    vendor_id: number;
    product_id: number;
    count: number;
    price: number;
    type: string;
    is_vat_included: boolean;
    memo?: string;
  }>;
}

export interface ResponseCreate {
  data: null;
}

const create = async function (data: RequestCreate) {
  const url = "adjustment/item";
  const response = await v2Axios.post<ResponseCreate>(url, data);
  return response.data;
};

export interface adjustmentItemResponse {
  id: number;
  is_inactive: boolean;
  created_date: string;
  cleared_time: string | null;
  rt_store_id: number;
  ws_store_id: number;
  vendor_info: VendorInfo;
  product_info: ProductInfo;
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

// 입고장 수정하기 요청 타입
export interface RequestUpdateAdj extends AdjustmentProduct {
  item_id: number;
}

export interface ResponseUpdateAdj {
  data: AdjustmentProduct;
}

const updateAdjustment = async function (data: RequestUpdateAdj) {
  const url = `adjustment/item/${data.item_id}`;
  const response = await v2Axios.put<ResponseUpdateAdj>(url, data);
  return response.data.data;
};

const adjustmentAPI = {
  getAdjustmentList,
  create,
  updateAdjustment,
  getAdjustmentForClearing,
};

export default adjustmentAPI;
