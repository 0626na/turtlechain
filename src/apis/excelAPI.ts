import { v2Axios } from "./index";
import { VendorAccount, VendorPhone } from "./vendorAPI";
import { WarehousingItem } from "./warehousingAPI";
import { saveAs } from "file-saver";
import moment from "moment";

export interface MasterVendor {
  id: number;
  name: string;
  phone: string;
  store_account: Array<VendorAccount>;
  store_phone: Array<VendorPhone>;
  address: string;
  building: string;
  floor: string;
  col: string;
  loc: string;
  ext: string;
}

export interface Vendor {
  vendor_code: string;
  name: string;
  address: string;
  account: string;
  ws_store_info: Array<MasterVendor>;
  match_type: string;

  memo: string;
  memo_active: boolean;
  memo_value: string;
  is_vat_included: boolean;
  use_vendor_name: string;
  use_vendor?: MasterVendor;
  use_account?: VendorAccount;
  check_account?: boolean;
}

export interface Product {
  vendor_id: string;
  vendor_code: string;
  vendor_name: string;
  vendor_address: string;
  product_code: string;
  name: string;
  vendor_product_name: string;
  price: number;
  option: string;
  image_url: string;
  memo: string;

  memo_value?: string;
  memo_active?: boolean;
}

export interface OrderProduct {
  vendor_id: number;
  vendor_code: string;
  vendor_name: string;
  vendor_address: string;
  vendor_phone: string;
  vendor_product_name: string;

  product_id: number;
  product_code: string;
  product_name: string;
  product_price: string;

  count: number;
  order_price: number;
  option: string;
  image_url: string;
  memo: string;
  type: string;
}

export interface ParseCount {
  success_count: number;
  suggest_count: number;
  fail_count: number;
  duplicated_count: number;
}

/*
 *   거래처 파싱
 */

export interface ResponseParseVendor {
  msg: string;
  data: {
    success: Array<Vendor>;
    suggest: Array<Vendor>;
    fail: Array<Vendor>;
    count: ParseCount;
    error?: string;
  };
}

const parseVendor = async function (data: FormData) {
  const url = `excel/vendor`;
  const response = await v2Axios.post<ResponseParseVendor>(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/*
 *   상품 파싱
 */

export interface ResponseParseProduct {
  msg: string;
  data: {
    success: Array<Product>;
    fail: Array<Product>;
    count: {
      duplicated_count: number;
    };
    error?: string;
  };
}

const parseProduct = async function (data: FormData) {
  const url = `excel/product`;
  const response = await v2Axios.post<ResponseParseProduct>(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/*
 *   주문 파싱
 */

export interface ResponseParseOrder {
  msg: string;
  data: {
    success: Array<OrderProduct>;
    fail: Array<OrderProduct>;
    error: string;
  };
}

const parseOrder = async function (data: FormData) {
  const url = `excel/order`;
  const response = await v2Axios.post<ResponseParseOrder>(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/*
 *   입고 파싱
 */

export interface ResponseParseWarehousing {
  msg: string;
  data: {
    success: Array<WarehousingItem>;
    fail: Array<WarehousingItem>;
    count: ParseCount;
    error: string;
  };
}

const parseWarehousing = async function (data: FormData) {
  const url = `excel/warehousing`;
  const response = await v2Axios.post<ResponseParseWarehousing>(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

interface RequestDownload {
  rt_store_id?: number;
  start_date: string;
  end_date: string;
}

// 정산내역 다운로드
const downloadClearing = async function (query: RequestDownload) {
  let url = `excel/download/clearing?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get(url);
  // 파일 저장
  saveAs(
    new Blob([response.data], { type: "application/ms-excel" }),
    `${moment(query.start_date).format("YYMMDD")}_${moment(query.end_date).format(
      "YYMMDD",
    )}_정산내역.xlsx`,
  );
};

const excelAPI = {
  parseVendor,
  parseProduct,
  parseWarehousing,
  parseOrder,
  downloadClearing,
};

export default excelAPI;
