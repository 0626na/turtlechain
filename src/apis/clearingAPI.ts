import { DataSourceItemType } from "antd/lib/auto-complete";
import { mockAxios } from "./index";

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

// Request: 정산장 조회
export interface RequestGetClearingSheet {
  rt_store_id: number;
  rt_store_name: string;
  total_amount: number;
}

// Response: 정산장 조회
export interface ResponseGetClearingSheet {
  msg: string;
  data: ClearingSheet;
}

const getClearingSheet = async function (query: RequestGetClearingSheet) {
  let url = "/v2/clearing_sheet?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await mockAxios.get<ResponseGetClearingSheet>(url);
  return response.data;
};

// Request: 정산장 생성
export interface RequestCreateClearingSheet {
  rt_store_id: number;
  rt_store_name: string;
  total_amount: number;
}

// Response: 정산장 생성
export interface ResponseCreateClearingSheet {
  msg: string;
  data: number;
}

const createClearingSheet = async function (data: RequestCreateClearingSheet) {
  let url = "/v2/clearing/sheet";
  const response = await mockAxios.post<ResponseCreateClearingItem>(url, data);
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
  let url = `/v2/clearing/sheet/${data.id}`;
  const response = await mockAxios.post<ResponseUpdateClearingSheet>(url, data);
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
  data: Array<warehousingItem | adjustmentItem>;  
}

// Response: 거래처 리스트
export interface ResponseCreateClearingItem {
  msg: string;
  data: {};
}

// const getVendors = async function (query: RequestGetVendors) {
//   let url = "/v2/vendor?";
//   for (const [key, value] of Object.entries(query)) {
//     url = url + `${key}=${value}&`;
//   }
//   const response = await mockAxios.get<ResponseGetVendors>(url);
//   return response.data;
// };

// Request: 거래처 수정
export interface RequestUpdateVendor {
  id: number;
  memo: string;
  is_taxed: boolean;
}

// Response: 거래처 수정
export interface ResponseUpdateVendor {
  msg: string;
}

const updateVendor = async function (data: RequestUpdateVendor) {
  const url = `v2/vendor/${data.id}`;
  const response = await mockAxios.put<ResponseUpdateVendor>(url, data);
  return response.data;
};

const vendorAPI = {
  getClearingSheet,
  createClearingSheet,
};

export default vendorAPI;
