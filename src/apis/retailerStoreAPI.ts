import { v2Axios } from "apis";

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
    data: Array<{
      id: number;
      name: string;
      mall_url: string;
      phone: string;
      alimtalk_name: string;
    }>;
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

const retailerStoreAPI = {
  getStores,
};

export default retailerStoreAPI;
