import { v2Axios } from "apis";

// 입고장 타입
export interface Sheet {
  id: number;
  mall_id: number;
  mall_name: string;
  created_date: Date;
  created_time: Date;
  is_deleted: boolean;
  is_confirmed: boolean;
  total_price: number;
  total_item_count: number;
  total_store_count: number;
  total_item_subcount: number;
  created_by: number;
}

// 입고장 상세내역 타입
export interface SheetItem {
  id: number;
  sheet_id: number;
  mall_id: number;
  mall_name: string;
  store_id: number;
  store_code: number;
  store_name: string;
  address: string;
  product_id: number;
  product_code: string;
  product_name: string;
  option: string;
  count: number;
  price: number;
  memo: string;
  created_by: number;
  created_time: Date;
  is_deleted: boolean;
}

// 입고장 상세내역 추가 타입
export interface CreateSheetItem {
  mall_id: number;
  mall_name: string;
  store_id: number;
  store_code: number;
  store_name: string;
  address: string;
  product_id: number;
  product_code: string;
  product_name: string;
  option: string;
  count: number;
  price: number;
  memo: string;
}

// 입고장 요청 타입
export interface RequestGetSheet {
  mall_id: number | "";
  is_confirmed: number | "";
  start_date: string;
  end_date: string;
  offset: number;
  last_id: number;
  switch_type: "next" | "prev";
}

export interface ResponseGetSheet {
  data: {
    data: Array<Sheet>;
    total_count: number;
  };
}

// 입고장 상세내역 요청 타입
export type RequestGetSheetItem = number;

export interface ResponseGetSheetItem {
  data: Array<SheetItem>;
}

// 입고장 수정하기 요청 타입
export interface RequestUpdateSheet extends Sheet {
  sheet_id: number;
}

export interface ResponseUpdateSheet {
  data: Sheet;
}

// 입고장 상세내역 대량 수정하기 타입
export interface RequestBulkUpdateSheetItem {
  sheet_id: number;
  items: Array<SheetItem>;
}

export interface ResponseBulkUpdateSheetItem {
  data: null;
}

// 입고장 추가하기 요청 타입
export interface RequestCreateSheet {
  created_date: string;
  mall_id: number;
  mall_name: string;
}

export interface ResponseCreateSheet {
  data: number;
}

// 입고장 상세내역 추가하기 요청 타입
export interface RequestCreateSheetItem {
  sheet_id: number;
  item_list: Array<CreateSheetItem>;
}

export interface ResponseCreateSheetItem {
  data: null;
}

// 입고장 가져오기
const getSheet = async function (query: RequestGetSheet) {
  let url = "warehousing/sheet?";
  for (const [key, value] of Object.entries(query)) {
    value !== "" && (url = url + `${key}=${value}&`);
  }

  const response = await v2Axios.get<ResponseGetSheet>(url);
  return response.data.data;
};

// 입고장 상세내역 가져오기
const getSheetItem = async function (sheet_id: RequestGetSheetItem) {
  const url = `warehousing/item?sheet_id=${sheet_id}`;
  const response = await v2Axios.get<ResponseGetSheetItem>(url);
  return response.data;
};

// 입고장 수정하기
const updateSheet = async function (data: RequestUpdateSheet) {
  const url = `warehousing/sheet/${data.sheet_id}`;
  const response = await v2Axios.put<ResponseUpdateSheet>(url, data);
  return response.data.data;
};

// 입고장 상세내역 대량 수정하기
const bulkUpdateSheetItem = async function (data: RequestBulkUpdateSheetItem) {
  const url = "warehousing/item/bulk_update";
  const response = await v2Axios.put<ResponseBulkUpdateSheetItem>(url, data);
  return response.data;
};

// 입고장 추가하기
const createSheet = async function (data: RequestCreateSheet) {
  const url = "warehousing/sheet";
  const response = await v2Axios.post<ResponseCreateSheet>(url, data);
  return response.data;
};

// 입고장 상세내역 추가하기
const createSheetItem = async function (data: RequestCreateSheetItem) {
  const url = "warehousing/item";
  const response = await v2Axios.post<ResponseCreateSheetItem>(url, data);
  return response.data;
};

const warehousingAPI = {
  getSheet,
  getSheetItem,
  updateSheet,
  bulkUpdateSheetItem,
  createSheet,
  createSheetItem,
};

export default warehousingAPI;
