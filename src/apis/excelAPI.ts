import { v2Axios } from "./index";
import { VendorAccount, VendorPhone } from "./vendorAPI";

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

export interface ParseCount {
  success_count: number;
  suggest_count: number;
  fail_count: number;
}

export interface RequestParseVendor {
  files: FormData;
  rt_store_id: number;
}

export interface ResponseParseVendor {
  msg: string;
  data: {
    success: Array<Vendor>;
    suggest: Array<Vendor>;
    fail: Array<Vendor>;
    count: ParseCount;
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

export interface Product {
  vendor_id: string;
  vendor_code: string;
  vendor_name: string;
  vendor_address: string;
  product_code: string;
  name: string;
  vendor_product_name: string;
  price: string;
  option: string;
  image_url: string;
  memo: string;
}

export interface ProductShow extends Product {
  memo_value: string;
  memo_active: boolean;
}

export interface ResponseParseProduct {
  msg: string;
  data: {
    success: Array<Product>;
    fail: Array<Product>;
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

const excelAPI = {
  parseVendor,
  parseProduct,
};

export default excelAPI;
