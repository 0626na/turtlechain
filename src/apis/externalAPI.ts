import { v2Axios } from '.';
import { ParseCount, Vendor } from '@apis/excelAPI';
import { WarehousingItem } from './warehousingAPI';

export interface RequestConnectInventory {
  rt_store_id: number;
}

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
const connectSellmateWarehousing = async function (
  query: RequestConnectInventory,
) {
  let url = 'external-api/inventory/warehousing?';
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
const connectSellmateVendor = async function (query: RequestConnectInventory) {
  let url = 'external-api/inventory/vendors?';
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetVendor>(url);
  return response.data;
};

const externalAPI = {
  connectSellmateWarehousing,
  connectSellmateVendor,
};

export default externalAPI;
