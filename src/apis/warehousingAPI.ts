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

// 입고상품
export interface WarehousingProduct {
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
}

// 입고상품 가져오기
export interface WarehousingProductShow {
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
export interface RequestCreateProduct {
  sheet_id?: number;
  rt_store_id: number;
  item_list: Array<{
    vendor_id: number;
    product_id: number;
    count: number;
    price: number;
    memo?: string;
  }>;
}

// Response: 입고상품 생성
export interface ResponseCreateProduct {
  data: null;
}

// 입고 생성
const create = async function (data: { sheet: RequestCreateSheet; product: RequestCreateProduct }) {
  let url = "warehousing/sheet";
  const sheetResponse = await v2Axios.post<ResponseCreateSheet>(url, data.sheet);
  url = "warehousing/item";
  const productResponse = await v2Axios.post<ResponseCreateProduct>(url, {
    ...data.product,
    sheet_id: sheetResponse.data.data,
  });
  return productResponse.data;
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
export type RequestGetProduct = {
  sheet_id: number;
};

// Response: 입고상품 리스트
export interface ResponseGetProduct {
  msg: string;
  data: {
    item_list: Array<WarehousingProductShow>;
    total_count: number;
  };
}

// 입고상품 리스트 가져오기
const getProduct = async function (data: RequestGetProduct) {
  const url = `warehousing/item?sheet_id=${data.sheet_id}`;
  const response = await v2Axios.get<ResponseGetProduct>(url);
  return response.data;
};

// Request: 입고상품 수정
export interface RequestUpdateProduct {
  sheet_id: number;
  items: Array<{
    id: number;
    is_inactive: boolean;
    count: number;
  }>;
}

// Response: 입고상품 수정
export interface ResponseUpdateProduct {
  data: null;
}

// 입고상품 수정 요청
const updateProduct = async function (data: RequestUpdateProduct) {
  const url = "warehousing/item/bulk_update";
  const response = await v2Axios.put<ResponseUpdateProduct>(url, data);
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
 *
 *
 *
 *
 * 수정중
 */

// 입고장 상세내역 대량 수정하기 타입
// export interface RequestBulkUpdateSheetItem {
//   sheet_id: number;
//   items: Array<WarehousingSheetItem>;
// }

export type RequestGetSheetItem = number;

export interface ResponseGetSheetItem {
  data: {
    item_list: Array<WarehousingItemForClearing>;
    total_count: number;
  };
}

// 입고장 상세내역 가져오기
const getSheetItem = async function (sheet_id: RequestGetSheetItem) {
  const url = `warehousing/item?sheet_id=${sheet_id}`;
  const response = await v2Axios.get<ResponseGetSheetItem>(url);
  return response.data;
};

export interface VendorAccount {
  id: number;
  account_number: string;
  account_holder: string;
  bank: string;
}

export interface ProductInfo {
  id: number;
  product_code: string;
  name: string;
  vendor_product_name: string;
  price: number;
  option: string;
}

export interface WarehousingItemForClearing {
  id: number;
  sheet_id: number;
  rt_store_id: number;
  vendor_info: VendorInfo;
  product_info: ProductInfo;
  count: number;
  price: number;
  is_vat_included: boolean;
  memo: string | null;
}

export interface WarehousingItem2 {
  id: number;
  sheet_id: number;
  rt_store_id: number;
  vendor_info: VendorInfo;
  product_info: ProductInfo;
  count: number;
  price: number;
  is_vat_included: boolean;
  memo: string | null;
  is_inactive: boolean | false;
}

export interface VendorInfo {
  id: number;
  ws_store: WsStoreInfo;
  vendor_code: string;
  vendor_name: string;
  vendor_address: string;
  vendor_account: VendorAccount;
}

export interface WsStoreInfo {
  id: number;
  name: string;
  building: string;
  floor: string;
  col: string;
  loc: string;
  ext: string;
}

const warehousingAPI = {
  create,
  getSheet,
  updateSheet,
  getProduct,
  updateProduct,
  // 수정예정
  getSheetItem,
};

export default warehousingAPI;
