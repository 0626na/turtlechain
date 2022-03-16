import { v2Axios } from "./index";
import { VendorInfo, ProductInfo } from "./warehousingAPI";

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
    id: number;
    vendor_name: string;
  };
  product_info: {
    id: number;
    name: string;
    vendor_product_name: string;
  };
  memo: string;
  memo_active?: boolean;
  memo_value?: string;
}

// Request: 매입조정 리스트 조회
export interface RequestGetList {
  rt_store_id: number;
  page: number;
  start_date?: string;
  end_date?: string;
  is_cleared?: number | "";
  type: "reserve" | "takeback" | "exchange" | "refund" | "all";
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

// Request: 매입조정 상품 수정
export interface RequestUpdate extends AdjustmentProductShow {
  //item_id: number;
  is_inactive: boolean;
  product_id: number;
  vendor_id: number;
}

// Response: 매입조정 상품 수정
export interface ResponseUpdate {
  data: AdjustmentProduct;
}

// 매입조정 상품 수정
const update = async function (data: RequestUpdate) {
  const url = `adjustment/item/${data.id}`;
  const response = await v2Axios.put<ResponseUpdate>(url, data);
  return response.data.data;
};

/**
 *
 *
 *
 * 정산 페이지 사용 api
 *
 */
// Request: 매입조정 아이템 조회
export interface RequestGetAdjustmentForClearing {
  rt_store_id: number | undefined;
  start_date?: string;
  end_date?: string;
  type?: "reserve" | "takeback" | "exchange" | "refund";
  is_cleared?: number;
}

// TODO: 없애야함(중복) but 정산에서 사용중 so 버리면안됨
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

const adjustmentAPI = {
  getList,
  create,
  update,
  getAdjustmentForClearing,
};

export default adjustmentAPI;
