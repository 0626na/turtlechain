import { v2Axios } from "apis";

// 거래처 계좌 타입
export interface VendorAccount {
  id: number;
  account_number: string;
  account_holder: string;
  bank: string;
}

// 거래처 휴대번호 타입
export interface VendorPhone {
  id: number;
  phone: string;
  send_alimtalk: boolean;
}

// 거처 사업자 타입
export interface VendorCompany {
  name: string;
  owner: string;
  biz_num: string;
}

// 거래처 타입
export interface Vendor {
  id: number;
  vendor_code: string;
  vendor_name: string;
  vendor_address: string;
  is_vat_included: boolean;
  memo: string;
  vendor_phone: VendorPhone;
  vendor_account: VendorAccount;
  ws_store_info: Wholesale;
}

// 마스터 도매 타입
export interface Wholesale {
  id: number;
  name: string;
  phone: string;
  store_account: Array<VendorAccount>;
  store_phone: Array<VendorPhone>;
  company: Array<VendorCompany>;
  building: string;
  floor: string;
  col: string;
  loc: string;
  ext: string;
}

// Request: 마스터 도매 검색
export interface RequestSearchWholesale {
  page: number;
  type: string;
  search_string: string;
}

// Response: 마스터 도매 검색
export interface ResponseSearchWholesale {
  msg: string;
  data: {
    total_count: number;
    vendor_list: Array<Wholesale>;
  };
}

// 마스터 도매 검색
const searchWholesale = async function (query: RequestSearchWholesale) {
  let url = `provisioning/search_wholesale?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseSearchWholesale>(url);
  return response.data;
};

// Request: 거래처 등록
export interface RequestCreateVendor {
  rt_store_id: number;
  vendor_code: string;
  vendor_account_id: number;
  vendor_phone_id: number;
  ws_store_id?: number;
  vendor_address?: string;
  vendor_name?: string;
  memo?: string;
  is_vat_included?: boolean;
  owner?: string;
  biz_num?: string;
  biz_name?: string;
}

// Response: 거래처 등록
export interface ResponseCreateVendor {
  msg: string;
  data: {
    fail_count: number;
    success_count: number;
  };
}

// 거래처 등록 요청
const createVendor = async function (data: Array<RequestCreateVendor>) {
  const url = `provisioning/vendor`;
  const response = await v2Axios.post<ResponseCreateVendor>(url, data);
  return response.data;
};

// Request: 거래처 리스트
export interface RequestGetVendorList {
  page: number;
  type: string;
  search_string: string;
  rt_store_id?: number;
}

// Response: 거래처 리스트
export interface ResponseGetVendorList {
  msg: string;
  data: { vendor_list: Array<Vendor>; total_count: number };
}

// 거래처 리스트 요청
const getVendorList = async function (query: RequestGetVendorList) {
  let url = "provisioning/vendor?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetVendorList>(url);
  return response.data;
};

// Request: 거래처 수정
export interface RequestUpdateVendor {
  id: number;
  memo: string;
  is_vat_included: boolean;
}

// Response: 거래처 수정
export interface ResponseUpdateVendor {
  msg: string;
}

// 거래처 수정 요청
const updateVendor = async function (data: RequestUpdateVendor) {
  const url = `provisioning/vendor/${data.id}`;
  const response = await v2Axios.put<ResponseUpdateVendor>(url, data);
  return response.data;
};

const vendorAPI = {
  getVendorList,
  updateVendor,
  createVendor,
  searchWholesale,
};

export default vendorAPI;
