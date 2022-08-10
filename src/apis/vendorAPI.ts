import { v2Axios } from '.';

// 파싱, 연동 vendor
export interface VendorConnect {
  vendor_code: string;
  name: string;
  address: string;
  account: string;
  ws_store_info: Array<WholesaleShow>;
  match_type: string;

  memo: string;
  memo_active: boolean;
  memo_value: string;
  is_vat_included: boolean;
  use_vendor_name: string;
  use_vendor?: WholesaleShow;
  use_account?: VendorAccount;
  check_account?: boolean;
}

export interface ConnectCount {
  success_count: number;
  suggest_count: number;
  fail_count: number;
  duplicated_count: number;
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

/*
 *  재고 프로그램 연동
 */

export interface RequestConnectInventory {
  rt_store_id: number;
  target_date: string;
}

export interface ResponseConnectInventory {
  msg: string;
  data: {
    success: Array<VendorConnect>;
    suggest: Array<VendorConnect>;
    fail: Array<VendorConnect>;
    count: ConnectCount;
    error?: string;
  };
}

const connectInventory = async function (params: RequestConnectInventory) {
  let url = 'external-api/inventory/vendors?';
  const response = await v2Axios.get<ResponseConnectInventory>(url, { params });

  return response.data;
};

/*
 *  엑셀 파싱
 */

export interface ResponseParseExcel {
  msg: string;
  data: {
    success: Array<VendorConnect>;
    suggest: Array<VendorConnect>;
    fail: Array<VendorConnect>;
    count: ConnectCount;
    error?: string;
  };
}

const parseExcel = async function (data: FormData) {
  const url = `excel/vendor`;
  const response = await v2Axios.post<ResponseParseExcel>(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/*
 *   거래처 리스트
 */

export interface RequestGet {
  page: number;
  type: string;
  search_string: string;
  rt_store_id?: number;
}

export interface ResponseGet {
  msg: string;
  data: { vendor_list: Array<VendorShow>; total_count: number };
}

const get = async function (query: RequestGet) {
  let url = 'provisioning/vendor?';
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGet>(url);
  return response.data;
};

/*
 *  거래처 코드 생성
 */

export interface RequestGetCode {
  rt_store_id: number;
  ws_store_id: number;
}

export interface ResponseGetCode {
  msg: string;
  data: string;
}

const getCode = async function (query: RequestGetCode) {
  let url = `provisioning/create_vendor_code?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetCode>(url);
  return response.data;
};

/*
 *  거래처 생성
 */

export interface RequestCreate {
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

export interface ResponseCreate {
  msg: string;
  data: {
    fail_count: number;
    success_count: number;
  };
}

const create = async function (data: Array<RequestCreate>) {
  const url = `provisioning/vendor`;
  const response = await v2Axios.post<ResponseCreate>(url, data);
  return response.data;
};

export interface RequestUpdate {
  id: number;
  memo?: string;
  is_vat_included?: boolean;
  vendor_name?: string;
  is_inactive?: boolean;
}

export interface ResponseUpdate {
  msg: string;
}

// 거래처 수정 요청
const update = async (data: RequestUpdate) => {
  const url = `provisioning/vendor/${data.id}`;
  const response = await v2Axios.patch<ResponseUpdate>(url, data);

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
  connectInventory,
  parseExcel,
  get,
  getCode,
  create,
  update,
  getWholesale,
};

export default vendorAPI;
