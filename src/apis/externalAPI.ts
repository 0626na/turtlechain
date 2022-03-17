import { v2Axios } from "apis";
import { ParseCount, Product } from "apis/excelAPI";
import { WarehousingProduct } from "./warehousingAPI";

export interface RequestQuery {
  rt_store_id: number;
}

// Response: 상품 연동
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

// 셀메이트 상품연동 요청
const getSellmateProduct = async function (query: RequestQuery) {
  let url = "external-api/inventory/products?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetProduct>(url);
  return response.data;
};

// Response: 입고상품 연동
export interface ResponseGetWarehousing {
  msg: string;
  data: {
    success: Array<WarehousingProduct>;
    fail: Array<WarehousingProduct>;
    count: ParseCount;
    error: string;
  };
}

const getSellmateWarehousing = async function (query: RequestQuery) {
  let url = "external-api/inventory/warehousing?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetWarehousing>(url);
  return response.data;
};

const externalAPI = {
  getSellmateProduct,
  getSellmateWarehousing,
};

export default externalAPI;
