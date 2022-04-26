import { v2Axios } from "apis";

export interface Store {
  id: number;
  name: string;
  mall_url: string;
  phone: string;
  alimtalk_name: string;
  is_closed: boolean;
  order_formats: number;
  store_account: Array<{
    id: number;
    bank: string;
    account_number: string;
    account_holder: string;
  }>;
  created_time: Date;
  updated_time: Date;
  created_by: string;
  updated_by: string;
}

// 쇼핑몰 리스트 가져오기
export interface RequestGetStores {
  offset: number;
  last_id: number;
  switch_type: "next" | "prev";
  search_type: "is_closed" | "";
  search_query: string;
}

export interface ResponseGetStores {
  data: {
    total_count: number;
    data: Array<Store>;
  };
}

const getStores = async function (query: RequestGetStores) {
  let url = "/provisioning/retailer_store?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetStores>(url);
  return response.data;
};

// 개별 쇼핑몰 가져오기
export type RequestGetStore = number | undefined;

export interface ResponseGetStore {
  data: Store;
}

const getStore = async function (store_id: RequestGetStore) {
  let url = `/provisioning/retailer_store/${store_id}`;
  const response = await v2Axios.get<ResponseGetStore>(url);
  return response.data;
};

// 수정하기
export interface RequestUpdate {
  store_id: number;
  name: string;
  mall_url: string;
  phone: string;
  alimtalk_name: string;
  order_formats: number;
}

export interface ResponseUpdate {
  data: null;
}

const update = async function (data: RequestUpdate) {
  let url = `/provisioning/retailer_store/${data.store_id}`;
  const response = await v2Axios.patch<ResponseUpdate>(url, data);
  return response.data;
};

// 추가하기
export interface RequestCreate {
  name: string;
  mall_url: string;
  phone: string;
  alimtalk_name: string;
  order_formats: number;
}

export interface ResponseCreate {
  data: null;
}

const create = async function (data: RequestCreate) {
  let url = `/provisioning/retailer_store`;
  const response = await v2Axios.post<ResponseCreate>(url, data);
  return response.data;
};

const retailerStoreAPI = {
  getStores,
  getStore,
  update,
  create,
};

export default retailerStoreAPI;
