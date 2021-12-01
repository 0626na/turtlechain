import { v2Axios } from "apis";

export interface WarehousingSheet {
  id: number;
  mall_id: number;
  mall_name: string;
  created_date: Date;
  created_time: Date;
  is_deleted: boolean;
  total_price: number;
  total_item_count: number;
  total_store_count: number;
  total_item_subcount: number;
  created_by: number;
}

// 입고장 리스트 가져오기
export interface RequestGetSheet {
  mall_id: number | "all";
  is_confirmed: number | "all";
  start_date: string;
  end_date: string;
  offset: number;
  last_id: number;
  switch_type: "next" | "prev";
}

export interface ResponseGetSheet {
  data: {
    data: Array<WarehousingSheet>;
    total_count: number;
  };
}

const getSheet = async function (query: RequestGetSheet) {
  let url = "warehousing/sheet?";
  for (const [key, value] of Object.entries(query)) {
    value !== "all" && (url = url + `${key}=${value}&`);
  }

  const response: any = await v2Axios.get<ResponseGetSheet>(url);
  return response.data.data;
};

const warehousingAPI = {
  getSheet,
};

export default warehousingAPI;
