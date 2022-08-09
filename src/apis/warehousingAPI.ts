import { v2Axios } from '.';

// 파싱, 연동된 입고 상품
export interface WarehousingItemConnect {
  vendor_id: number;
  vendor_name: string;
  vendor_address: string;

  product_id: number;
  product_name: string;
  vendor_product_name: string;
  product_option: string;
  product_code: number;
  store_house: string;

  price: number;
  count: number;
  memo?: string;

  // 입고 미리보기에서 index로 사용
  index?: number;
  is_reserved?: boolean;
}

// 입고장
export interface WarehousingSheet {
  id: number;
  is_confirmed: boolean;
  created_date: string;
  created_time: string;
  clearing_sheet_id: number;
  total_amount: number;
  total_row_count: number;
  total_store_count: number;
  total_item_count: number;
  created_by: number;
  rt_store_id: number;
  is_inactive: boolean;
}

// 입고상품 가져오기
export interface WarehousingItem {
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

/*
 * 재고프로그램 연동
 */

export interface RequestConnectInventory {
  rt_store_id: number;
  start_date: string;
  end_date: string;
}

export interface ResponseConnectInventory {
  msg: string;
  data: {
    success: Array<WarehousingItemConnect>;
    fail: Array<WarehousingItemConnect>;
    count: {
      success_count: number;
      suggest_count: number;
      fail_count: number;
      duplicated_count: number;
    };
    error: string;
  };
}

const connectInventory = async function (params: RequestConnectInventory) {
  let url = 'external-api/inventory/warehousing';
  const response = await v2Axios.get<ResponseConnectInventory>(url, { params });
  return response.data;
};

/*
 *   엑셀 파싱
 */

const parseExcel = async function (data: FormData) {
  const url = `excel/warehousing`;
  const response = await v2Axios.post<ResponseConnectInventory>(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/*
 *  입고장 생성
 */

export interface RequestCreateSheet {
  created_date: string;
  rt_store_id: number;
}

export interface ResponseCreateSheet {
  msg: string;
  data: number;
}

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

export interface ResponseCreateItem {
  data: null;
}

const create = async function (data: {
  sheet: RequestCreateSheet;
  item: RequestCreateItem;
}) {
  let url = 'warehousing/sheet';
  const sheetResponse = await v2Axios.post<ResponseCreateSheet>(
    url,
    data.sheet,
  );
  url = 'warehousing/item';
  const itemResponse = await v2Axios.post<ResponseCreateItem>(url, {
    ...data.item,
    sheet_id: sheetResponse.data.data,
  });
  return itemResponse.data;
};

/*
 * 입고장 리스트 요청
 */

export interface RequestGetSheet {
  rt_store_id: number;
  is_confirmed: number | '';
  start_date: string;
  end_date: string;
  did_settlement?: number;
  page: number;
}

export interface ResponseGetSheet {
  data: {
    sheet_list: Array<WarehousingSheet>;
    total_count: number;
  };
}

const getSheet = async function (query: RequestGetSheet) {
  let url = 'warehousing/sheet?';
  for (const [key, value] of Object.entries(query)) {
    value !== '' && (url = url + `${key}=${value}&`);
  }
  const response = await v2Axios.get<ResponseGetSheet>(url);
  return response.data.data;
};

/*
 *  입고 상품 리스트
 */

export type RequestGetItem = {
  rt_store_id?: number;
  sheet_id?: number;
  product_name?: string;
  start_date?: string;
  end_date?: string;
};

export interface ResponseGetItem {
  msg: string;
  data: {
    item_list: Array<WarehousingItem>;
    total_count: number;
  };
}

const getItem = async (params: RequestGetItem) => {
  const url = `warehousing/item`;
  const response = await v2Axios.get<ResponseGetItem>(url, { params });

  return response.data;
};

/*
 * 입고장 수정하기
 */

export interface RequestUpdateSheet {
  id: number;
  is_inactive?: boolean;
  is_confirmed?: boolean;
}

export interface ResponseUpdateSheet {
  msg: string;
  data: WarehousingSheet;
}

const updateSheet = async function (data: RequestUpdateSheet) {
  const url = `warehousing/sheet/${data.id}`;
  const response = await v2Axios.patch<ResponseUpdateSheet>(url, data);
  return response.data.data;
};

/*
 *  입고상품 수정
 */

export interface RequestUpdateItem {
  sheet_id: number;
  items: Array<{
    id: number;
    is_inactive: boolean;
    count: number;
  }>;
}

export interface ResponseUpdateItem {
  data: null;
}

const updateItem = async function (data: RequestUpdateItem) {
  const url = 'warehousing/item/bulk_update';
  const response = await v2Axios.patch<ResponseUpdateItem>(url, data);
  return response.data;
};

const warehousingAPI = {
  connectInventory,
  parseExcel,
  create,
  getSheet,
  getItem,
  updateSheet,
  updateItem,
};

export default warehousingAPI;
