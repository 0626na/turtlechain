import { mockAxios } from "./index";
// 거래처 계좌 타입
export interface VendorAccount {
  id: number;
  account_number: string;
  account_holder: string;
  bank: string;
  is_proxy: boolean;
  is_deleted: boolean;
}

// 거래처 휴대번호 타입
export interface VendorPhone {
  id: number;
  is_deleted: boolean;
  phone: string;
  send_alimtalk: boolean;
  tag: string;
}

// 거래처 타입
export interface Vendor {
  id: number;
  vendor_id: string;
  ws_store_id: number;
  is_taxed: boolean;
  memo: string;
  ws_store_info: {
    store_account: Array<VendorAccount>;
    store_phone: Array<VendorPhone>;
    name: string;
    phone: string;
    building: string;
    floor: string;
    col: string;
    row: string;
    loc: string;
    ext: string;
  };
}

// Request: 거래처 리스트
export interface RequestGetVendors {
  page: number;
  type: string;
  search_query: string;
  rt_store_id: number | "";
}

// Response: 거래처 리스트
export interface ResponseGetVendors {
  msg: string;
  data: { data: Array<Vendor>; total_count: number };
}

const getVendors = async function (query: RequestGetVendors) {
  let url = "/v2/vendor?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await mockAxios.get<ResponseGetVendors>(url);
  return response.data;
};

// Request: 거래처 수정
export interface RequestUpdateVendor {
  id: number;
  memo: string;
  is_taxed: boolean;
}

// Response: 거래처 수정
export interface ResponseUpdateVendor {
  msg: string;
}

const updateVendor = async function (data: RequestUpdateVendor) {
  const url = `v2/vendor/${data.id}`;
  const response = await mockAxios.put<ResponseUpdateVendor>(url, data);
  return response.data;
};

const vendorAPI = {
  getVendors,
  updateVendor,
};

export default vendorAPI;
