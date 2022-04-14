import { v2Axios } from "./index";

// 잔여 매입조정 금액
export interface BalanceShow {
  id: number;
  original_id: number;
  refund_amount: number;
  overpaid_amount: number;
  created_time: string;
  process_type: string;
  memo: string;
  vendor_info: {
    id: number;
    vendor_name: string;
    vendor_address: string;
    is_vat_included: boolean;
    ws_store_id: number;
  };

  // 거래처별 입고된 금액 프론트에서 계산해줌
  warehousing_amount?: number;
  // 차감할 금액
  subtract_price?: number;
}

// 정산서
export interface ClearingSheetShow {
  id: number;
  created_time: string;
  status: "request" | "pending" | "complete";
  store_id: number;
  store_name: string;
  request_date: string;
  complete_date: string | null;
  clearing_total_price: number;
}

// 정산 아이템
export interface ClearingItemShow {}

// Request: 정산서 생성
export interface RequestCreateSheet {
  store_id?: number;
  store_name?: string;
  clearing_total_price: number;
  total_vat_price: number;
}

// Response: 정산서 생성
export interface ResponseCreateSheet {
  msg: string;
  data: number;
}

// Request: 정산 상품 생성
export interface RequestCreateItem {
  sheet_id?: number;
  rt_store_id?: number;
  rt_store_name?: string;
  warehousing_item_list: Array<{
    sheet_id: number;
    warehousing_item_id: number;
    ws_store_id: number;
    vendor_id: number;
    is_reserved: boolean;
    total_price: number;
    deposit_price: number;
    supply_price: number;
    vat_price: number;
  }>;
  subtract_item_list: Array<{
    ws_store_id: number;
    vendor_id: number;
    price: number;
    is_vat_included: boolean;
  }>;
  reserve_item_list: Array<{
    adjustment_item_id: number;
    ws_store_id: number;
    vendor_id: number;
    price: number;
    is_vat_included: boolean;
  }>;
}

// Response: 정산 상품 생성
export interface ResponseCreateItem {
  msg: string;
}

// 정산서 생성 요청
const create = async function (data: { sheet: RequestCreateSheet; item: RequestCreateItem }) {
  let url = "clearing/sheet";
  const sheetResponse = await v2Axios.post<ResponseCreateSheet>(url, data.sheet);
  url = "clearing/item";
  const itemResponse = await v2Axios.post<ResponseCreateItem>(url, {
    ...data.item,
    sheet_id: sheetResponse.data.data,
  });
  return itemResponse.data;
};

// Request: 매입 결제대기 항목
export interface RequestGetBalance {
  // 매입조정 처리내역 확인할때
  rt_store_id?: number;
  vendor_id?: number;
  start_date?: string;
  end_date?: string;
  // 페이지 구분
  tab?: "balance" | "balance_detail" | "adjustment";
  // 정산에서 매입차감 위해 조회할 때
  warehousing_sheet_id?: string;
  // 매입조정 상세 조회할 때
  original_id?: number;
}

// Response: 매입 결제대청 항목
export interface ResponseGetBalance {
  msg: string;
  data: {
    item_list: Array<BalanceShow>;
    total_count: number;
  };
}

// 매입 결제대기 항목 요청
const getBalance = async function (query: RequestGetBalance) {
  let url = "clearing/balance?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetBalance>(url);
  return response.data;
};

// Request: 정산서 조회
export interface RequestGetSheet {
  store_id?: number;
  date_filter?: "request_date" | "complete_date";
  start_date: string;
  end_date: string;
  page?: number;
  page_size?: number;
  status: string; // "request" | "pending" | "complete" | "all"
}

// Response: 정산서 조회
export interface ResponseGetSheet {
  msg: string;
  data: {
    sheet_list: ClearingSheetShow[];
    total_count: number;
    clearing_summary: {
      request: {
        count: number;
        price: number;
      };
      pending: {
        count: number;
        price: number;
      };
      complete: {
        count: number;
        price: number;
      };
    };
  };
}

// 정산서 조회 요청
const getSheet = async function (query: RequestGetSheet) {
  let url = "clearing/sheet?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetSheet>(url);
  return response.data;
};

// Request: 정산장 수정 요청
export interface RequestUpdateSheet extends ClearingSheetShow {
  // 삭제 요청시 1
  is_inactive: number;
}

// Response: 정산장 수정
export interface ResponseUpdateSheet {
  msg: string;
  data: number;
}

// 정산장 수정 요청
const updateSheet = async function (data: RequestUpdateSheet) {
  let url = `clearing/sheet/${data.id}`;
  const response = await v2Axios.put<ResponseUpdateSheet>(url, data);
  return response.data;
};

// Request: 정산 아이템 조회
export interface RequestGetItem {
  sheet_id: number;
  page_size: 100;
}

// Response: 정산 아이템 조회
export interface ResponseGetItem {
  msg: string;
  data: {
    item_list: Array<{
      id: number;
      created_by: number;
      created_time: string;
      created_date: string;
      sheet_id: number;
      is_inactive: boolean;
      type: string;
      original_id: number;
      adjustment_type: string;
      adjustment_process_type: string;
      rt_store_id: number;
      rt_store_name: string;
      vendor_id: number;
      vendor_name: string;
      vendor_address: string;
      recipient_print: string;
      is_vat_included: boolean;
      bank: string;
      account_number: string;
      account_holder: string;
      memo: string | null;
      total_price: number;
      deposit_price: number;
      supply_price: number;
      vat_price: number;
    }>;
    total_count: number;
  };
}

// 정산 아이템 조회 요청
const getItem = async function (query: RequestGetItem) {
  let url = "clearing/item?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetItem>(url);
  return response.data;
};

interface RequestGetItemDetail {
  item_id: number;
}

interface ResponseGetItemDetail {
  msg: string;
  data: {
    item_list: Array<{
      vendor_name: string;
      vendor_address: string;
      bank: string;
      account_number: string;
      account_holder: string;
      deposit_price: number;
      supply_price: number;
      vat_price: number;
      clearing_type: string;
      memo: string;
    }>;
  };
}

const getItemDetail = async function (query: RequestGetItemDetail) {
  const url = `clearing/item/${query.item_id}`;
  const response = await v2Axios.get<ResponseGetItemDetail>(url);
  return response.data;
};

const clearingAPI = {
  create,
  getBalance,
  getSheet,
  updateSheet,
  getItem,
  getItemDetail,
};

export default clearingAPI;
