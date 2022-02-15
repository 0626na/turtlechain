import { v2Axios } from "apis";

export interface VendorInfo {
  id: number;
  vendor_code: string;
  vendor_name: string;
  vendor_address: string;
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

export interface RequestCreateProducts {
  rt_store_id: number;
  vendor_id: number;
  product_id: number;
  name: string;
  price: number;
  image_url: string;
  vendor_product_name: string;
  option: string;
  memo: string;
}

export interface ResponseCreateProducts {
  msg: string;
  data: {
    fail_with_vendor_id: number;
    fail_with_less_data: number;
    already_exist_product_id: number;
  };
}

const createProducts = async function (data: Array<RequestCreateProducts>) {
  const url = `provisioning/product`;
  const response = await v2Axios.post<ResponseCreateProducts>(url, data);
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

const productAPI = {
  getProductList,
  createProducts,
};

export default productAPI;
