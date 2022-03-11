import { v2Axios } from "apis";

export interface VendorInfo {
  id: number;
  vendor_code: string;
  vendor_name: string;
  vendor_address: string;
  vendor_phone: {
    phone: string;
  };
}

export interface Product {
  id: number;
  rt_store_id: number;
  vendor_info: VendorInfo;
  product_code: string;
  name: string;
  vendor_product_name: string;
  price: number;
  option: string;
  memo: string;
  image_url: string;
}

export interface RequestGetProductList {
  rt_store_id?: number;
  page: number;
  search_string: string;
  type: string;
  vendor_id?: number;
}

export interface ResponseGetProductList {
  msg: string;
  data: {
    product_list: Array<Product>;
    total_count: number;
  };
}

const getProductList = async function (query: RequestGetProductList) {
  let url = "provisioning/product?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetProductList>(url);
  return response.data;
};

export interface RequestCreateProduct {
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

export interface ResponseCreateProduct {
  msg: string;
  data: {
    success: number;
    fail: number;
  };
}

const createProduct = async function (data: Array<RequestCreateProduct>) {
  const url = `provisioning/product`;
  const response = await v2Axios.post<ResponseCreateProduct>(url, data);
  return response.data;
};

export interface RequestUpdateProduct {
  id: number;
  name: string;
  price: string;
  option: string;
  memo: string;
}

export interface ResponseUpdateProduct {
  msg: string;
  data: {};
}

const updateProduct = async function (data: RequestUpdateProduct) {
  const url = `provisioning/product/${data.id}`;
  const response = await v2Axios.put<ResponseUpdateProduct>(url, data);
  return response.data;
};

export interface RequestGetCode {
  rt_store_id: number;
  vendor_code: string;
}

export interface ResponseGetCode {
  msg: string;
  data: string;
}

const getCode = async function (query: RequestGetCode) {
  let url = "provisioning/create_product_code?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetCode>(url);
  return response.data;
};

const productAPI = {
  getProductList,
  createProduct,
  updateProduct,
  getCode,
};

export default productAPI;
