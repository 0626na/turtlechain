import { v2Axios } from "./index";
import { VendorInfo, ProductInfo } from "./warehousingAPI";

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

// 매입조정 상품
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
}

// 매입조정 상품 Show
export interface AdjustmentProductShow {
  id: number;
  count: number;
  count_left: number;
  is_cleared: boolean;
  is_vat_included: boolean;
  created_date: string;
  price: number;
  type: "reserve" | "takeback" | "exchange" | "refund";
  vendor_info: {
    vendor_name: string;
  };
  product_info: {
    name: string;
    vendor_product_name: string;
  };
}

// Request: 매입조정 리스트 조회
export interface RequestGetList {
  rt_store_id: number;
  page: number;
  start_date?: string;
  end_date?: string;
  is_cleared?: number | "";
  type: "reserve" | "takeback" | "exchange" | "balance" | "all";
}

// Response: 매입조정 리스트 조회
export interface ResponseGetList {
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
    adjustment_list: Array<AdjustmentProductShow>;
  };
}

// 매입조정 리스트 조회 요청
const getList = async function (query: RequestGetList) {
  let url = "adjustment/item?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetList>(url);
  return response.data;
};

// Request: 매입조정 생성
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

// Response: 매입조정 생성
export interface ResponseCreate {
  data: null;
}

// 매입조정 생성 요청
const create = async function (data: RequestCreate) {
  const url = "adjustment/item";
  const response = await v2Axios.post<ResponseCreate>(url, data);
  return response.data;
};

// Request: 매입조정 아이템 조회
export interface RequestGetAdjustmentForClearing {
  rt_store_id: number | undefined;
  start_date?: string;
  end_date?: string;
  type?: "reserve" | "takeback" | "exchange" | "refund";
  is_cleared?: number;
}

// TODO: 없애야함(중복)
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

// Response: 매입조정 아이템 조회
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

// 매입조정 아이템 조회 요청
const getAdjustmentForClearing = async function (query: RequestGetAdjustmentForClearing) {
  let url = "adjustment/item?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetAdjustmentForClearing>(url);
  return response.data;
};

// Request: 매입조정 상품 수정
export interface RequestUpdateAdj extends AdjustmentProduct {
  item_id: number;
}

// Response: 매입조정 상품 수정
export interface ResponseUpdateAdj {
  data: AdjustmentProduct;
}

// 매입조정 상품 수정
const updateAdjustment = async function (data: RequestUpdateAdj) {
  const url = `adjustment/item/${data.item_id}`;
  const response = await v2Axios.put<ResponseUpdateAdj>(url, data);
  return response.data.data;
};

const adjustmentAPI = {
  getList,
  create,
  updateAdjustment,
  getAdjustmentForClearing,
};

export default adjustmentAPI;
