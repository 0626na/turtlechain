import { v2Axios } from "apis";
import { ParseCount, Product, Vendor } from "apis/excelAPI";
import { WarehousingItem } from "./warehousingAPI";

export interface RequestQuery {
  rt_store_id: number;
}

// Response: 상품 연동
export interface ResponseConnectProduct {
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
const connectSellmateProduct = async function (query: RequestQuery) {
  let url = "external-api/inventory/products?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseConnectProduct>(url);
  return response.data;
};

// Response: 입고상품 연동
export interface ResponseConnectWarehousing {
  msg: string;
  data: {
    success: Array<WarehousingItem>;
    fail: Array<WarehousingItem>;
    count: ParseCount;
    error: string;
  };
}

// 셀메이트 입고연동 요청
const connectSellmateWarehousing = async function (query: RequestQuery) {
  let url = "external-api/inventory/warehousing?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseConnectWarehousing>(url);
  return response.data;
};

// Response: 셀메이트 거래처 연동
export interface ResponseGetVendor {
  msg: string;
  data: {
    success: Array<Vendor>;
    suggest: Array<Vendor>;
    fail: Array<Vendor>;
    count: ParseCount;
    error?: string;
  };
}

// 셀메이트 거래처 연동 요청
const connectSellmateVendor = async function (query: RequestQuery) {
  let url = "external-api/inventory/vendors?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetVendor>(url);
  return response.data;
};

const externalAPI = {
  connectSellmateProduct,
  connectSellmateWarehousing,
  connectSellmateVendor,
};

export default externalAPI;
