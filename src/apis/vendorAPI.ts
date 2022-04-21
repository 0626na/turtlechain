import { v2Axios } from "apis";

export interface Vendor {
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

// 거래처 사업자 타입
export interface VendorCompany {
  name: string;
  owner: string;
  biz_num: string;
}

// 거래처 타입
export interface VendorShow {
  id: number;
  vendor_code: string;
  vendor_name: string;
  vendor_address: string;
  is_vat_included: boolean;
  memo: string;
  vendor_phone: VendorPhone;
  vendor_account: VendorAccount;
  ws_store_info: WholesaleShow;
  memo_active?: boolean;
  memo_value?: string;
}

// 마스터 도매 타입
export interface WholesaleShow {
  id: number;
  name: string;
  phone: string;
  address: string;
  store_account: Array<VendorAccount>;
  store_phone: Array<VendorPhone>;
  company: Array<VendorCompany>;
  building: string;
  floor: string;
  col: string;
  loc: string;
  ext: string;
}

// Request: 거래처 리스트
export interface RequestGet {
  page: number;
  type: string;
  search_string: string;
  rt_store_id?: number;
}

// Response: 거래처 리스트
export interface ResponseGet {
  msg: string;
  data: { vendor_list: Array<VendorShow>; total_count: number };
}

// 거래처 리스트 요청
const get = async function (query: RequestGet) {
  let url = "provisioning/vendor?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGet>(url);
  return response.data;
};

// request: 거래처 코드 생성
export interface RequestGetCode {
  rt_store_id: number;
  ws_store_id: number;
}

// response: 거래처 코드 생성
export interface ResponseGetCode {
  msg: string;
  data: string;
}

// 거래처 코드 생성 요청
const getCode = async function (query: RequestGetCode) {
  let url = `provisioning/create_vendor_code?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetCode>(url);
  return response.data;
};

// Request: 거래처 등록
export interface RequestCreate extends Vendor {}

// Response: 거래처 등록
export interface ResponseCreate {
  msg: string;
  data: {
    fail_count: number;
    success_count: number;
  };
}

// 거래처 등록 요청
const create = async function (data: Array<RequestCreate>) {
  const url = `provisioning/vendor`;
  const response = await v2Axios.post<ResponseCreate>(url, data);
  return response.data;
};

// Request: 거래처 수정
export interface RequestUpdate {
  id: number;
  memo: string;
  is_vat_included: boolean;
}

// Response: 거래처 수정
export interface ResponseUpdate {
  msg: string;
}

// 거래처 수정 요청
const update = async function (data: RequestUpdate) {
  const url = `provisioning/vendor/${data.id}`;
  const response = await v2Axios.put<ResponseUpdate>(url, data);
  return response.data;
};

// Request: 마스터 도매 검색
export interface RequestGetWholesale {
  page: number;
  type: string;
  search_string: string;
}

// Response: 마스터 도매 검색
export interface ResponseGetWholesale {
  msg: string;
  data: {
    total_count: number;
    vendor_list: Array<WholesaleShow>;
  };
}

// 마스터 도매 검색
const getWholesale = async function (query: RequestGetWholesale) {
  let url = `provisioning/search_wholesale?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetWholesale>(url);
  return response.data;
};

const vendorAPI = {
  get,
  getCode,
  create,
  update,
  getWholesale,
};

export default vendorAPI;
