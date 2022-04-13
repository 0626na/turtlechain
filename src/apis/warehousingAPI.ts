import { v2Axios } from "apis";

// 입고장
export interface WarehousingSheet {
  id: number;
  is_confirmed: boolean;
  created_date: string;
  created_time: string;
  clearing_sheet_id: number;
  total_price: number;
  total_row_count: number;
  total_store_count: number;
  total_item_count: number;
  created_by: number;
  rt_store_id: number;
  is_inactive: boolean;
}

// 입고 상품
export interface WarehousingItem {
  vendor_id: number;
  vendor_name: string;
  vendor_address: string;

  product_id: number;
  product_name: string;
  vendor_product_name: string;
  product_option: string;
  product_code: number;

  price: number;
  count: number;
  memo?: string;

  // 입고 미리보기에서 index로 사용
  index?: number;
  is_reserved?: boolean;
}

// 입고상품 가져오기
export interface WarehousingItemShow {
  id: number;
  sheet_id: number;
  vendor_info: {
    id: number;
    vendor_name: string;
    vendor_address: string;
    ws_store_id: number;
  };
  product_info: {
    id: number;
    name: string;
    vendor_product_name: string;
    price: number;
    option: string;
    product_code: string;
  };
  count: number;
  price: number;
  memo: string;
  is_vat_included: boolean;
  is_inactive: boolean;
  is_reserved: boolean;
  created_date: string;
}

// Request: 입고장 생성
export interface RequestCreateSheet {
  created_date: string;
  rt_store_id: number;
}

// Response: 입고장 생성
export interface ResponseCreateSheet {
  msg: string;
  data: number;
}

// Request: 입고상품 생성
export interface RequestCreateItem {
  sheet_id?: number;
  rt_store_id: number;
  item_list: Array<{
    vendor_id: number;
    product_id: number;
    count: number;
    price: number;
    is_reserved?: boolean;
    memo?: string;
  }>;
}

// Response: 입고상품 생성
export interface ResponseCreateItem {
  data: null;
}

// 입고 생성
const create = async function (data: { sheet: RequestCreateSheet; item: RequestCreateItem }) {
  let url = "warehousing/sheet";
  const sheetResponse = await v2Axios.post<ResponseCreateSheet>(url, data.sheet);
  url = "warehousing/item";
  const itemResponse = await v2Axios.post<ResponseCreateItem>(url, {
    ...data.item,
    sheet_id: sheetResponse.data.data,
  });
  return itemResponse.data;
};

// Request: 입고장 리스트 가져오기
export interface RequestGetSheet {
  rt_store_id: number;
  is_confirmed: number | "";
  start_date: string;
  end_date: string;
  did_settlement?: number;
  page: number;
}

// Response: 입고장 리스트 가져오기
export interface ResponseGetSheet {
  data: {
    sheet_list: Array<WarehousingSheet>;
    total_count: number;
  };
}

// 입고장 리스트 가져오기 요청
const getSheet = async function (query: RequestGetSheet) {
  let url = "warehousing/sheet?";
  for (const [key, value] of Object.entries(query)) {
    value !== "" && (url = url + `${key}=${value}&`);
  }
  const response = await v2Axios.get<ResponseGetSheet>(url);
  return response.data.data;
};

// Request: 입고장 수정
export interface RequestUpdateSheet extends WarehousingSheet {}

// Response: 입고장 수정
export interface ResponseUpdateSheet {
  data: WarehousingSheet;
}

// 입고장 수정하기 요청
const updateSheet = async function (data: RequestUpdateSheet) {
  const url = `warehousing/sheet/${data.id}`;
  const response = await v2Axios.put<ResponseUpdateSheet>(url, data);
  return response.data.data;
};

// Request: 입고상품 리스트
export type RequestGetItem = {
  sheet_id: number;
};

// Response: 입고상품 리스트
export interface ResponseGetItem {
  msg: string;
  data: {
    item_list: Array<WarehousingItemShow>;
    total_count: number;
  };
}

// 입고상품 리스트 가져오기
const getItem = async function (data: RequestGetItem) {
  const url = `warehousing/item?sheet_id=${data.sheet_id}`;
  const response = await v2Axios.get<ResponseGetItem>(url);
  return response.data;
};

// Request: 입고상품 수정
export interface RequestUpdateItem {
  sheet_id: number;
  items: Array<{
    id: number;
    is_inactive: boolean;
    count: number;
  }>;
}

// Response: 입고상품 수정
export interface ResponseUpdateItem {
  data: null;
}

// 입고상품 수정 요청
const updateItem = async function (data: RequestUpdateItem) {
  const url = "warehousing/item/bulk_update";
  const response = await v2Axios.put<ResponseUpdateItem>(url, data);
  return response.data;
};

const warehousingAPI = {
  create,
  updateSheet,
  updateItem,
  getSheet,
  getItem,
};

export default warehousingAPI;
