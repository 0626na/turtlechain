import { v2Axios } from '.';
import { RcFile } from 'antd/lib/upload';

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
  need_update: boolean;
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
  need_update: boolean;
}

/*
 *  재고연동
 */

export interface RequestConnectInventory {
  rt_store_id: number;
  start_date: string;
  end_date: string;
}

export interface ResponseConnectInventory {
  msg: string;
  data: {
    success: Array<Product>;
    fail: Array<Product>;
    count: {
      success_count: number;
      fail_count: number;
      duplicated_count: number;
    };
    error?: string;
  };
}

const connectInventory = async function (params: RequestConnectInventory) {
  const url = 'external-api/inventory/products';
  const response = await v2Axios.get<ResponseConnectInventory>(url, { params });

  return response.data;
};

/*
 *   엑셀 파싱
 */

export interface RequestParseExcel {
  files: RcFile;
  rt_store_id: number;
}

const parseExcel = async function (data: RequestParseExcel) {
  const url = `excel/product`;
  const formData = new FormData();
  formData.append('files', data.files);
  formData.append('rt_store_id', data.rt_store_id.toString());
  const response = await v2Axios.post<ResponseConnectInventory>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/*
 *  상품 리스트
 */

export interface RequestGetList {
  rt_store_id?: number;
  page: number;
  search_string: string;
  type: string;
  vendor_id?: number;
}

export interface ResponseGetList {
  msg: string;
  data: {
    product_list: Array<ProductShow>;
    total_count: number;
  };
}

const getList = async function (params: RequestGetList) {
  const url = 'provisioning/product?';
  const response = await v2Axios.get<ResponseGetList>(url, { params });

  return response.data;
};

/*
 * 상품 생성
 */

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

export interface ResponseCreate {
  msg: string;
  data: {
    success: number;
    fail: number;
  };
}

const create = async function (data: RequestCreate[]) {
  const url = `provisioning/product`;
  const response = await v2Axios.post<ResponseCreate>(url, data);

  return response.data;
};

/*
 * 상품수정
 */
export interface RequestUpdate {
  id: number;
  memo: string;
  need_update: boolean;
}

export interface ResponseUpdate {
  msg: string;
  data: {};
}

const update = async function (data: RequestUpdate) {
  const url = `provisioning/product/${data.id}`;
  const response = await v2Axios.patch<ResponseUpdate>(url, data);

  return response.data;
};

/*
 * 상품삭제
 */

export interface RequestRemove {
  id: number;
  is_inactive: boolean;
}

export interface ResponseRemove {
  msg: string;
  data: {};
}

const remove = async (data: RequestRemove) => {
  const url = `provisioning/product/${data.id}`;
  const response = await v2Axios.patch<ResponseRemove>(url, data);

  return response.data;
};

/*
 * 상품 코드 생성
 */
export interface RequestGetCode {
  rt_store_id: number;
  vendor_code: string;
}

export interface ResponseGetCode {
  msg: string;
  data: string;
}

const getCode = async function (params: RequestGetCode) {
  const url = 'provisioning/create_product_code?';

  const response = await v2Axios.get<ResponseGetCode>(url, { params });
  return response.data;
};

const productAPI = {
  connectInventory,
  parseExcel,
  getList,
  create,
  update,
  remove,
  getCode,
};

export default productAPI;
