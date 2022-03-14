import { v2Axios } from "./index";
import { VendorAccount, VendorPhone } from "./vendorAPI";
import { WarehousingProduct } from "./warehousingAPI";

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
}

export interface VendorShow extends Vendor {
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
}

export interface ProductShow extends Product {
  memo_value: string;
  memo_active: boolean;
}

export interface OrderItem {
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
    success: Array<OrderItem>;
    fail: Array<OrderItem>;
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
    success: Array<WarehousingProduct>;
    fail: Array<WarehousingProduct>;
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

const excelAPI = {
  parseVendor,
  parseProduct,
  parseWarehousing,
  parseOrder,
};

export default excelAPI;
