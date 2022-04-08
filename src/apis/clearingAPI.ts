import { v2Axios } from "./index";

// 잔여 매입조정 금액
export interface BalanceShow {
  id: number;
  original_id: number;
  refund_amount: number;
  overpaid_amount: number;
  vendor_info: {
    id: number;
    vendor_name: string;
    is_vat_included: boolean;
    ws_store_id: number;
  };

  // 거래처별 입고된 금액 프론트에서 계산해줌
  warehousing_amount?: number;
  // 차감할 금액
  subtract_price?: number;
}

// Request: 정산서 생성
export interface RequestCreateSheet {
  store_id: number;
  store_name: string;
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
  original_id?: number;
  // 정산에서 매입차감 위해 조회할 때
  warehousing_sheet_id?: string;
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
/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * 수정예정
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

export interface ClearingSheet {
  id: number;
  created_time: string;
  is_inactive: boolean;
  status: "request" | "pending" | "complete";
  rt_store_id: number;
  rt_store_name: string;
  request_date: string;
  complete_date: string | null;
  total_price: number;
  created_by: number;
}

interface ws_store_company {
  id: number;
  name: string;
  biz_num: string;
  is_closed: boolean;
  memo: string;
}

interface ws_store_account {
  id: number;
  account_number: string;
  account_holder: string;
  bank: string;
  is_proxy: boolean;
  is_deleted: boolean;
}

interface ws_store_phone {
  id: number;
  is_deleted: boolean;
  created_time: string;
  updated_time: string;
  phone: string;
  send_alimtalk: boolean;
  tag: string;
  deleted_by: number | null;
  created_by: number;
  updated_by: number;
  store: number;
}

interface ws_store {
  id: number;
  name: string;
  phone: string;
  building: string;
  floor: string;
  col: string;
  loc: string;
  ext: string;
  is_closed: boolean;
  memo: string;
  companies: ws_store_company;
  created_by: string;
  updated_by: string;
  created_time: string;
  updated_time: string;
  deleted_time: string;
  store_account: Array<ws_store_account>;
  store_phone: Array<ws_store_phone>;
}

export interface ResponseClearingItem {
  id: number;
  ws_store_id: ws_store;
  created_by: number;
  created_time: string;
  created_date: string;
  sheet_id: number;
  is_inactive: boolean;
  type: string;
  original_id: number;
  adjustment_type: string | null;
  adjustment_process_type: string | null;
  rt_store_id: number;
  rt_store_name: string;
  vendor_id: number;
  vendor_name: string;
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
}

// Request: 정산장 조회
export interface RequestGetClearingSheet {
  rt_store_id: number | undefined;
  date_filter?: "request_date" | "complete_date";
  start_date?: string; // format: YYYY-MM-DD
  end_date?: string; // format: YYYY-MM-DD
  page?: number;
  page_size?: number;
  status?: "request" | "pending" | "complete" | "";
}

// Response: 정산장 조회
export interface ResponseGetClearingSheet {
  msg: string;
  data: Array<ClearingSheet>;
}

const getClearingSheet = async function (query: RequestGetClearingSheet) {
  let url = "clearing/sheet?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetClearingSheet>(url);
  return response.data;
};

// Request: 정산장 수정
export interface RequestUpdateClearingSheet extends ClearingSheet {}

// Response: 정산장 수정
export interface ResponseUpdateClearingSheet {
  msg: string;
  data: number;
}

const updateClearingSheet = async function (data: RequestUpdateClearingSheet) {
  let url = `clearing/sheet/${data.id}`;
  const response = await v2Axios.put<ResponseUpdateClearingSheet>(url, data);
  return response.data;
};

// Request: 정산아이템 조회
export interface RequestGetClearingItem {
  sheet_id: number;
  page?: number;
  page_size?: number;
}

// Response: 정산장 조회
export interface ResponseGetClearingItem {
  msg: string;
  data: Array<ResponseClearingItem>;
}

const getClearingItem = async function (query: RequestGetClearingItem) {
  let url = "clearing/item?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetClearingItem>(url);
  return response.data;
};

const clearingAPI = {
  create,
  getBalance,
  // 수정예정
  getClearingSheet,
  getClearingItem,
  updateClearingSheet,
};

export default clearingAPI;
