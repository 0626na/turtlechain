import { v2Axios } from "apis";

export interface Product {
  vendor_id: number;
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

export interface ProductShow {
  id: number;
  rt_store_id: number;
  vendor_info: {
    id: number;
    vendor_code: string;
    vendor_name: string;
    vendor_address: string;
    vendor_phone: {
      phone: string;
    };
  };
  product_code: string;
  name: string;
  vendor_product_name: string;
  price: number;
  option: string;
  memo: string;
  image_url: string;
}

// request: 상품 목록 요청
export interface RequestGetList {
  rt_store_id?: number;
  page: number;
  search_string: string;
  type: string;
  vendor_id?: number;
}

// response: 상품 목록 요청
export interface ResponseGetList {
  msg: string;
  data: {
    product_list: Array<ProductShow>;
    total_count: number;
  };
}

// 상품 목록 요청
const getList = async function (query: RequestGetList) {
  let url = "provisioning/product?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetList>(url);
  return response.data;
};

// request: 상품 생성
export interface RequestCreate {
  rt_store_id: number;
  vendor_id: number;
  product_code: string;
  name: string;
  price: number;
  image_url: string;
  vendor_product_name: string;
  option: string;
  memo: string;
}

// response: 상품 생성
export interface ResponseCreate {
  msg: string;
  data: {
    success: number;
    fail: number;
  };
}

// 상품 생성 요청
const create = async function (data: Array<RequestCreate>) {
  const url = `provisioning/product`;
  const response = await v2Axios.post<ResponseCreate>(url, data);
  return response.data;
};

// request: 상품 수정
export interface RequestUpdate {
  id: number;
  name: string;
  price: string;
  option: string;
  memo: string;
}

// response: 상품 수정
export interface ResponseUpdate {
  msg: string;
  data: {};
}

// 상품 수정 요청
const update = async function (data: RequestUpdate) {
  const url = `provisioning/product/${data.id}`;
  const response = await v2Axios.put<ResponseUpdate>(url, data);
  return response.data;
};

// request: 상품 코드 생성
export interface RequestGetCode {
  rt_store_id: number;
  vendor_code: string;
}

// response: 상품 코드 생성
export interface ResponseGetCode {
  msg: string;
  data: string;
}

// 상품 코드 생성 요청
const getCode = async function (query: RequestGetCode) {
  let url = "provisioning/create_product_code?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetCode>(url);
  return response.data;
};

const productAPI = {
  getList,
  create,
  update,
  getCode,
};

export default productAPI;
