import { RcFile } from 'antd/lib/upload';
import { v2Axios } from '.';

//  엑셀, 연동 결과
export interface ParsedVendor {
  vendor_code: string;
  name: string;
  address: string;
  match_type: 'success' | 'wrong' | 'fail';
  ws_store_info: Wholesale[];
}

export interface ParesdResult {
  success_count: number;
  suggest_count: number;
  fail_count: number;
  duplicated_count: number;
}

// 거래처 사업자 타입
export interface VendorCompany {
  name: string;
  owner: string;
  biz_num: string;
}

// 거래처
export interface Vendor {
  id: number;
  created_time?: string;
  vendor_code: string;
  vendor_name: string;
  vendor_address: string;
  is_vat_included: boolean;
  memo: string;
  vendor_phone: VendorPhone;
  vendor_account: VendorAccount;
  ws_store_info: Wholesale;
  memo_active?: boolean;
  memo_value?: string;
}

// 거래처 계좌 타입
export interface VendorAccount {
  id?: number;
  account_number: string;
  account_holder: string;
  bank: string;
}

// 거래처 휴대번호 타입
export interface VendorPhone {
  id: number;
  phone: string;
}

// 마스터 도매
export interface Wholesale {
  id: number;
  name: string;
  phone: string;
  address: string;
  store_account: VendorAccount[];
  store_phone: VendorPhone[];
  company: VendorCompany[];
  building: string;
  floor: string;
  col: string;
  loc: string;
  ext: string;
}

/*
 *  재고 프로그램 연동
 */

export interface RequestVendorInventory {
  rt_store_id: number;
  start_date: string;
  end_date: string;
}

export interface ResponseVendorInventory {
  msg: string;
  data: {
    success: ParsedVendor[];
    suggest: ParsedVendor[];
    fail: ParsedVendor[];
    count: ParesdResult;
    error?: string;
  };
}

const inventory = async (params: RequestVendorInventory) => {
  const url = 'external-api/inventory/vendors';
  const response = await v2Axios.get<ResponseVendorInventory>(url, { params });

  return response.data;
};

/*
 *  엑셀 파싱
 */

export interface RequestExcel {
  file: RcFile;
  rt_store_id: number;
}

export interface ResponseExcel {
  msg: string;
  data: {
    success: ParsedVendor[];
    suggest: ParsedVendor[];
    fail: ParsedVendor[];
    count: ParesdResult;
    error?: string;
  };
}

const excel = async (data: RequestExcel) => {
  const url = `excel/vendor`;

  const formData = new FormData();
  formData.append('files', data.file);
  formData.append('rt_store_id', data.rt_store_id.toString());

  const response = await v2Axios.post<ResponseExcel>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/*
 *   거래처 리스트
 */

export interface RequestGetList {
  page: number;
  search_string: string;
  rt_store_id?: number;
}

export interface ResponseGetList {
  msg: string;
  data: { vendor_list: Vendor[]; total_count: number };
}

const getList = async (query: RequestGetList) => {
  let url = 'provisioning/vendor?';
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetList>(url);

  return response.data;
};

/*
 *   거래처 상세
 */

export interface RequestGet {
  id: number;
}

export interface ResponseGet {
  msg: string;
  data: Vendor;
}

// 거래처 상세보기
const get = async (params: RequestGet) => {
  const url = `provisioning/vendor/${params.id}`;
  const response = await v2Axios.get<ResponseGet>(url);

  return response.data.data;
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

const getCode = async (params: RequestGetCode) => {
  const url = `provisioning/create_vendor_code`;
  const response = await v2Axios.get<ResponseGetCode>(url, { params });

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
  is_vat_included?: boolean;
  owner?: string;
  memo?: string;
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

const create = async (data: RequestCreate[]) => {
  const url = `provisioning/vendor`;
  const response = await v2Axios.post<ResponseCreate>(url, data);

  return response.data;
};

export interface RequestUpdate {
  id: number;
  memo?: string;
  is_vat_included?: boolean;
  vendor_name?: string;
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

export interface RequestRemove {
  id: number;
  is_inactive: boolean;
}

export interface ResponseRemove {
  msg: string;
}

// 거래처 삭제 요청
const remove = async (data: RequestRemove) => {
  const url = `provisioning/vendor/${data.id}`;
  const response = await v2Axios.patch<ResponseRemove>(url, data);

  return response.data;
};

// Request: 마스터 도매 검색
export interface RequestGetWholesale {
  page: number;
  search_string: string;
}

// Response: 마스터 도매 검색
export interface ResponseGetWholesale {
  msg: string;
  data: {
    total_count: number;
    vendor_list: Wholesale[];
  };
}

// 마스터 도매 검색
const getWholesale = async (query: RequestGetWholesale) => {
  let url = `provisioning/search_wholesale?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetWholesale>(url);
  return response.data;
};

const vendorAPI = {
  inventory,
  excel,
  getList,
  get,
  getCode,
  create,
  update,
  remove,
  getWholesale,
};

export default vendorAPI;
