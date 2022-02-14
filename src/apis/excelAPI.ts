import { RcFile, UploadChangeParam } from "antd/lib/upload";
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
  is_taxed: boolean;
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

export interface RequestParseVendors {
  files: FormData;
  rt_store_id: number;
}

export interface ResponseParseVendors {
  msg: string;
  data: {
    success: Array<Vendor>;
    suggest: Array<Vendor>;
    fail: Array<Vendor>;
    count: ParseCount;
  };
}

const parseVendors = async function (data: FormData) {
  const url = `excel/vendor`;
  const response = await v2Axios.post<ResponseParseVendors>(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const excelAPI = {
  parseVendors,
};

export default excelAPI;
