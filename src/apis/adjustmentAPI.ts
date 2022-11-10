import { v2Axios } from '.';

// 매입조정 상품
export interface AdjustmentItem {
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
  type?: 'reserve' | 'takeback' | 'exchange' | 'refund';
  memo?: string | undefined;
  // 매입조정 상품 등록 최대개수
  product_count_max?: number;
}

type AdjustmentProcessType = 'subtract' | 'refund';
// 매입조정 상품 Show
export interface AdjustmentItemShow {
  id: number;
  rt_store_id?: number;
  ws_store_id: number;
  count: number;
  count_left: number;
  is_cleared: string;
  created_date: string;
  type: 'reserve' | 'takeback' | 'exchange';
  vendor_info: {
    id: number;
    vendor_name: string;
  };
  product_info: {
    id: number;
    name: string;
    vendor_product_name: string;
    option: string;
    price: number;
  };
  memo: string;
  memo_active?: boolean;
  memo_value?: string;
  // for 매입조정 처리
  process_count?: number;
  adjustment_process_type?: AdjustmentProcessType;
}

// Request: 매입조정 리스트 조회
export interface RequestGetList {
  rt_store_id: number | null;
  is_cleared: 'True' | 'False' | '';
  end_date: string;
  start_date: string;
  search_string?: string;

  page?: number;
}

// Response: 매입조정 리스트 조회
export interface ResponseGetList {
  msg: string;
  data: {
    adjustment_list: AdjustmentItemShow[];

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
  };
}

// 매입조정 리스트 조회 요청
const getList = async (params: RequestGetList) => {
  const url = 'adjustment/item';
  const response = await v2Axios.get<ResponseGetList>(url, { params });

  return response.data;
};

// Request: (매입 조정 상세)입고 및 매입조정 처리이력 조회
export interface RequestGet {
  adjustment_item_id: number;
}

// Response: (매입 조정 상세)입고 및 매입조정 처리이력 조회
export interface ResponseGet {
  msg: string;
  data: {
    transaction_list: Array<{
      id: number;
      created_datetime: string; // 처리 시작
      memo: string; // 처리 내용
    }>;
  };
}

// (매입 조정 상세)입고 및 매입조정 처리이력 요청
const get = async function (data: RequestGet) {
  const url = `adjustment/item/${data.adjustment_item_id}`;
  const response = await v2Axios.get<ResponseGet>(url);

  return response.data;
};

// Request: 매입조정 생성
export interface RequestCreate {
  item_list: Array<{
    rt_store_id: number;
    vendor_id: number;
    product_id: number;
    warehousing_item_id: number; // 미송의 경우 0
    count: number;
    price: number;
    type: string;
    is_vat_included?: boolean;
    memo?: string;
  }>;
}

// Response: 매입조정 생성
export interface ResponseCreate {
  data: null;
}

// 매입조정 생성 요청
const create = async function (data: RequestCreate) {
  const url = 'adjustment/item';
  const response = await v2Axios.post<ResponseCreate>(url, data);
  return response.data;
};

// Request: 매입조정 상품 수정
export interface RequestUpdate {
  id: number;

  memo?: string;
  is_inactive?: 1;

  // for 매입조정 처리
  process_count?: number;
  adjustment_process_type?: AdjustmentProcessType;
}

// Response: 매입조정 상품 수정
export interface ResponseUpdate {
  data: {
    is_inactive: boolean;
  };
}

// 매입조정 상품 수정
const update = async (data: RequestUpdate) => {
  const url = `adjustment/item/${data.id}`;
  const response = await v2Axios.put<ResponseUpdate>(url, data);

  return response.data.data;
};

const adjustmentAPI = {
  getList,
  create,
  update,
  get,
};

export default adjustmentAPI;
