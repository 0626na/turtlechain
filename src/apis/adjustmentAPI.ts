import { v2Axios } from "./index";

// 매입조정 상품
export interface AdjustmentProduct {
  index?: number;

  vendor_id: number;
  vendor_name: string;
  vendor_address: string;
  // 미송의 경우 0
  warehousing_item_id: number;

  product_id: number;
  product_name: string;
  vendor_product_name: string;
  product_option: string;
  product_price: number;
  product_code: string;
  is_vat_included: boolean;

  product_count: number;
  type: "reserve" | "takeback" | "exchange" | "refund" | "";
  memo?: string | undefined;
  // 매입조정 상품 등록 최대개수
  product_count_max?: number;
}

// 매입조정 상품 Show
export interface AdjustmentProductShow {
  id: number;
  ws_store_id: number;
  count: number;
  count_left: number;
  is_cleared: boolean;
  is_vat_included: boolean;
  created_date: string;
  price: number;
  type: "reserve" | "takeback" | "exchange";
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
  // for 매입조정 처리
  process_count?: number;
  adjustment_process_type?: "substract" | "refund";
}

// Request: 매입조정 리스트 조회
export interface RequestGetList {
  rt_store_id?: number;
  start_date: string;
  end_date: string;
  is_cleared?: number;
  page?: number;
  type?: "reserve" | "takeback" | "exchange" | "refund";
  // 당일 미송 조회시 넣어준다.
  original_id?: 0;
}

// Response: 매입조정 리스트 조회
export interface ResponseGetList {
  msg: string;
  data: {
    adjustment_summary: {
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
    // 미송의 경우 0
    warehousing_item_id: number;
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
export interface RequestUpdate {
  id: number;
  is_inactive?: boolean;
  memo?: string;

  // for 매입조정 처리
  process_count?: number;
  adjustment_process_type?: "substract" | "refund";
}

// Response: 매입조정 상품 수정
export interface ResponseUpdate {
  data: {
    is_inactive: boolean;
  };
}

// 매입조정 상품 수정
const update = async function (data: RequestUpdate) {
  const url = `adjustment/item/${data.id}`;
  const response = await v2Axios.put<ResponseUpdate>(url, data);
  return response.data.data;
};

// Request: 매입조정 상세보기
export interface RequestGet {
  id: number;
}

// Response: 매입조정 상세보기
export interface ResponseGet {
  msg: string;
  data: {
    clearing_info: Array<{
      id: number;
      created_date: string;

      vendor_name: string;
      vendor_address: string;
      bank: string;
      account_holder: string;
      account_number: string;

      total_price: number;
      supply_price: number;
      vat_price: number;
      is_vat_included: boolean;
      adjustment_process_type: "subtract" | "refund" | "";
      adjustment_type: "reserve" | "takeback" | "exchange" | "refund";
    }>;
    warehousing_info: {
      id: number;
      count: number;
      price: number;
      vendor_info: {
        vendor_name: string;
      };
      product_info: {
        name: string;
        vendor_product_name: string;
        option: string;
      };
    };
  };
}

// 매입조정 상세보기
const get = async function (data: RequestGet) {
  const url = `adjustment/item/${data.id}`;
  const response = await v2Axios.get<ResponseGet>(url);
  return response.data;
};

const adjustmentAPI = {
  getList,
  create,
  update,
  get,
};

export default adjustmentAPI;
