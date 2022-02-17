import { v2Axios } from "./index";

export interface ClearingSheet {
  id: number;
  created_time: string;
  is_inactive: boolean;
  status: "request" | "pending" | "complete",
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
  vat_price: number
}

// Request: 정산장 조회
export interface RequestGetClearingSheet {
  rt_store_id: number | undefined;
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

// Request: 정산장 생성
export interface RequestCreateClearingSheet {
  rt_store_id: number;
  rt_store_name: string;
  total_price: number;
}

// Response: 정산장 생성
export interface ResponseCreateClearingSheet {
  msg: string;
  data: number;
}

const createClearingSheet = async function (data: RequestCreateClearingSheet) {
  let url = "clearing/sheet";
  const response = await v2Axios.post<ResponseCreateClearingItem>(url, data);
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

// 정산아이템 생성 입고 데이터
export interface warehousingItem {
  type: "warehousing" | "adjustment";
  original_id: number;
  ws_store_id: number;
  vendor_id: number;
  vendor_name: string;
  bank: string;
  account_number: string;
  account_holder: string;
  is_vat_included: boolean;
  total_price: number;
  deposit_price: number;
  supply_price: number;
  vat_price: number;
}

// 정산아이템 생성 매입 데이터
export interface adjustmentItem extends warehousingItem {
  adjustment_type: "reserve" | "takeback" | "exchange" | "refund";
  adjustment_process_type: "subtract" | "refund";
}

// Request: 정산아이템 생성
export interface RequestCreateClearingItem {
  sheet_id: number;
  rt_store_id: number;
  rt_store_name: string;
  item_list: Array<warehousingItem | adjustmentItem>;  
}

// Response: 거래처 리스트
export interface ResponseCreateClearingItem {
  msg: string;
  data: {};
}

const createClearingItem = async function (data: RequestCreateClearingItem) {
  let url = "clearing/item";
  const response = await v2Axios.post<ResponseCreateClearingItem>(url, data);
  return response.data;
};

const clearingAPI = {
  getClearingSheet,
  createClearingSheet,
  updateClearingSheet,
  getClearingItem,
  createClearingItem,
};

export default clearingAPI;
