import { v2Axios } from "apis";
import { Product } from "apis/excelAPI";

export interface RequestQuery {
  rt_store_id: number;
}

export interface ResponseGetProduct {
  msg: string;
  data: {
    success: Array<Product>;
    fail: Array<Product>;
    count: {
      success_count: number;
      fail_count: number;
      duplicated_count: number;
    };
  };
}

const getSellmateProduct = async function (query: RequestQuery) {
  let url = "external-api/inventory/products?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetProduct>(url);
  return response.data;
};

const externalAPI = {
  getSellmateProduct,
};

export default externalAPI;
