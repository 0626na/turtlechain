import { v2Axios } from "apis";

// 입고장 리스트 가져오기
export type SheetList = Array<{
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
}>;

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
    data: SheetList;
    total_count: number;
  };
}

const getSheet = async function (query: RequestGetSheet) {
  let url = "warehousing/sheet?";
  for (const [key, value] of Object.entries(query)) {
    value !== "" && (url = url + `${key}=${value}&`);
  }

  const response = await v2Axios.get<ResponseGetSheet>(url);
  return response.data.data;
};

// 입고장 상세내역 리스트 가져오기
export type SheetItemList = Array<{
  id: number;
  sheet_id: number;
  is_deleted: boolean;
  mall_id: boolean;
  mall_name: string;
  store_code: number;
  store_name: string;
  address: string;
  size: string;
  color: string;
  count: number;
  price: number;
  product_code: number;
  product_name: string;
  memo: string | null;
  created_by: number;
  created_time: string;
}>;

export type RequestGetSheetItem = number;

export interface ResponseGetSheetItem {
  data: SheetItemList;
}

const getSheetItem = async function (sheet_id: RequestGetSheetItem) {
  const url = `warehousing/item?sheet_id=${sheet_id}`;
  const response = await v2Axios.get<ResponseGetSheetItem>(url);
  return response.data;
};

const warehousingAPI = {
  getSheet,
  getSheetItem,
};

export default warehousingAPI;
