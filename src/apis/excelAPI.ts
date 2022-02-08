import { RcFile, UploadChangeParam } from "antd/lib/upload";
import { v2Axios } from "./index";
import { VendorAccount, VendorPhone } from "./vendorAPI";

export interface Vendor {
  vendor_id: string;
  name: string;
  address: string;
  account: string;
  ws_store_info: Array<{
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
  }>;
  match_type: string;
}

export interface RequestParseVendors {
  files: any;
}

export interface ResponseParseVendors {
  msg: string;
  data: {
    success: Array<Vendor>;
    need_select_vendor: Array<Vendor>;
    need_select_account: Array<Vendor>;
    need_select: Array<Vendor>;
    fail: Array<Vendor>;
    count: {
      success_count: number;
      select_vendor_count: number;
      select_account_count: number;
      select_count: number;
      fail_count: number;
    };
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
