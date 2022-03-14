import { v2Axios } from "apis";

// 입고장 타입
export interface WarehousingSheet {
  start_date: string;
  id: number;
  created_date: Date;
  created_time: Date;
  is_inactive: boolean;
  clearing_sheet_id: number;
  total_price: number;
  total_row_count: number;
  is_confirmed: boolean;
  total_store_count: number;
  total_item_count: number;
  created_by: number;
  rt_store_id: number;
}

export interface WarehousingProduct {
  vendor_name: string;
  vendor_address: string;
  product_name: string;
  vendor_product_name: string;
  product_option: string;
  product_price: number;
  product_count: number;
  product_code: number;
  vendor_id: number;
  product_id: number;
}

export interface WarehousingProductShow extends WarehousingProduct {
  index: number;
}

// 입고장 상세내역 추가 타입
export interface CreateSheetItem {
  rt_store_id: number;
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
  rt_store_id: number | undefined;
  is_confirmed: number | "";
  start_date: string;
  end_date: string;
  did_settlement?: number;
  page: number | 1;
}

export interface ResponseGetSheet {
  data: {
    sheet_list: Array<WarehousingSheet>;
    total_count: number;
  };
}

// 입고장 상세내역 요청 타입
export type RequestGetSheetItem = number;

export interface ResponseGetSheetItem {
  data: {
    item_list: Array<WarehousingItemForClearing>;
    total_count: number;
  };
}

// 입고장 수정하기 요청 타입
export interface RequestUpdateSheet extends WarehousingSheet {
  sheet_id: number;
}

export interface ResponseUpdateSheet {
  data: WarehousingSheet;
}

// 입고장 상세내역 대량 수정하기 타입
// export interface RequestBulkUpdateSheetItem {
//   sheet_id: number;
//   items: Array<WarehousingSheetItem>;
// }

export interface ResponseBulkUpdateSheetItem {
  data: null;
}

// 입고장 추가하기 요청 타입
export interface RequestCreateSheet {
  created_date: string;
  rt_store_id: number;
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
// const createSheet = async function (data: RequestCreateSheet) {
//   const url = "warehousing/sheet";
//   const response = await v2Axios.post<ResponseCreateSheet>(url, data);
//   return response.data;
// };

// 입고장 상세내역 추가하기
const createSheetItem = async function (data: RequestCreateSheetItem) {
  const url = "warehousing/item";
  const response = await v2Axios.post<ResponseCreateSheetItem>(url, data);
  return response.data;
};

export interface VendorAccount {
  id: number;
  account_number: string;
  account_holder: string;
  bank: string;
}

// export interface VendorInfo {
//   id: number;
//   ws_store_id: number;
//   vendor_code: string;
//   vendor_name: string;
//   vendor_address: string;
//   vendor_account: VendorAccount;
// }

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

// 입고장 상세내역 추가 타입
export interface CreateSheetItems {
  vendor_id: number;
  product_id: number;
  count: number;
  price: number;
}

// 입고장 상세내역 추가하기 요청 타입
export interface RequestCreateSheetItems {
  sheet_id: number;
  rt_store_id: number;
  // rt_store_name: string;
  item_list: Array<CreateSheetItems>;
}

export interface ResponseCreateSheetItems {
  data: null;
}

// 입고장 상세내역 추가하기 요청 타입
export interface RequestCreateSheetItems {
  sheet_id: number;
  rt_store_id: number;
  // rt_store_name: string;
  item_list: Array<CreateSheetItems>;
}

export interface ResponseCreateSheetItems {
  data: null;
}

// 입고장 상세내역 추가하기 요청 타입
export interface RequestCreateSheetItems {
  sheet_id: number;
  rt_store_id: number;
  // rt_store_name: string;
  item_list: Array<CreateSheetItems>;
}

export interface ResponseCreateSheetItems {
  data: null;
}

// 입고장 상세내역 추가하기
const createSheetItems = async function (data: RequestCreateSheetItems) {
  const url = "warehousing/item";
  const response = await v2Axios.post<ResponseCreateSheetItems>(url, data);
  return response.data;
};

// 입고장 추가하기 요청 타입
export interface RequestCreateSheet {
  created_date: string;
  rt_store_id: number;
  // rt_store_name: string;
}

export interface ResponseCreateSheet {
  msg: string;
  data: number;
}

// 입고장 추가하기
const createSheet = async function (data: RequestCreateSheet) {
  const url = "warehousing/sheet";
  const response = await v2Axios.post<ResponseCreateSheet>(url, data);
  return response.data;
};

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

export interface ResponseBulkUpdateSheetItem {
  data: null;
}

export interface BulkUpdateSheetItem {
  id: number; // warehousing item id
  is_inactive: boolean;
  count: number;
}
// 입고장 상세내역 대량 수정하기 타입
export interface RequestBulkUpdateSheetItem {
  sheet_id: number;
  items: Array<BulkUpdateSheetItem>;
}

export type RequestGetSheetItem2 = number;

export interface ResponseGetSheetItem2 {
  data: {
    item_list: Array<WarehousingItem2>;
    total_count: number;
  };
}

// 입고장 상세내역 가져오기
const getSheetItem2 = async function (sheet_id: RequestGetSheetItem) {
  const url = `warehousing/item?sheet_id=${sheet_id}`;
  const response = await v2Axios.get<ResponseGetSheetItem2>(url);
  return response.data;
};

const warehousingAPI = {
  getSheet,
  getSheetItem,
  updateSheet,
  bulkUpdateSheetItem,
  createSheet,
  createSheetItem,
  createSheetItems,
  getSheetItem2,
};

export default warehousingAPI;
