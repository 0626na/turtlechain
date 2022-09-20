import { RcFile } from 'antd/lib/upload';
import { v2Axios } from '.';

// 주문 등록 추가 타입
export interface OrderItemShow {
  vendor_id: number;
  product_id: number;
  vendor_name: string;
  vendor_address: string;
  vendor_phone: string;
  product_name: string;
  product_code: string;
  product_option: string;
  count: number;
  price: number;
  type: string;
  image_url: string;
  memo: string;
}

// 주문서 타입
export interface OrderSheet {
  id: number;
  status: string;
  created_date: string;
  order_case_count: number;
  reserve_case_count: number;
  takeback_case_count: number;
  exchange_case_count: number;
  sample_case_count: number;
  pickup_case_count: number;
  extra_case_count: number;
  order_count: number;
  order_price: number;
  reserve_count: number;
  reserve_price: number;
  takeback_count: number;
  takeback_price: number;
  exchange_count: number;
  exchange_price: number;
  sample_count: number;
  sample_price: number;
  pickup_count: number;
  pickup_price: number;
  extra_count: number;
  extra_price: number;
  kakao: number;
  sms: number;
  fail: number;
  total_store_count: number;
  total_item_subcount: number;
  total_price: number;
}

export interface OrderItem {
  id: number;
  product_info: {
    vendor_info: {
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
  };
  count: number;
  price: number;
  type: string;
  memo: string;
  image_url: string;
}

export interface RequestGetList {
  rt_store_id: number;
  start_date: string;
  end_date: string;
}

export interface ResponseGetList {
  msg: string;
  data: {
    order_sheet_list: Array<OrderSheet>;
    total_count: number;
  };
}

const getList = async function (query: RequestGetList) {
  let url = `order/sheet?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetList>(url);
  return response.data;
};

export interface RequestGet {
  order_sheet_id: number;
}

export interface ResponseGet {
  msg: string;
  data: OrderSheet;
}

const get = async function (query: RequestGet) {
  const url = `order/sheet/${query.order_sheet_id}`;
  const response = await v2Axios.get<ResponseGet>(url);
  return response.data;
};

export interface RequestGetItem {
  sheet_id: number;
}

export interface ResponseGetItem {
  msg: string;
  data: {
    order_item_list: Array<OrderItem>;
    total_count: number;
  };
}

const getItem = async function (query: RequestGetItem) {
  let url = `order/item?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetItem>(url);
  return response.data;
};

export interface RequestCreateSheet {
  created_date: string;
  rt_store_id: number;
  status: 'N';
  type: 'new' | 'add' | 'modify';
}

export interface Item {
  vendor_id: number;
  product_id: number;
  count: number;
  price: number;
  type: string;
  image_url: string;
  memo: string;
}

export interface RequestCreateItem {
  sheet_id?: number;
  rt_store_id: number;
  item_list: Array<Item>;
}

export interface ResponseCreateSheet {
  msg: string;
  data: number;
}

export interface ResponseCreateItem {
  msg: string;
  data: null;
}

const create = async function (data: {
  sheet: RequestCreateSheet;
  item: RequestCreateItem;
}) {
  let url = `order/sheet`;
  const sheetResponse = await v2Axios.post<ResponseCreateSheet>(
    url,
    data.sheet,
  );
  url = `order/item`;
  const itemResponse = await v2Axios.post<ResponseCreateItem>(url, {
    ...data.item,
    sheet_id: sheetResponse.data.data,
  });
  return itemResponse.data;
};

/*
 * 발주서 양식 조회
 */

export interface ResponseGetOrderFormat {
  msg: string;
  data: {
    vendor_name: string[];
    vendor_address: string[];
    vendor_mobile: string[];
    product_name: string[];
    product_option: string[];
    product_count: string[];
    product_price: string[];
    order_type: string[];
    memo: string[];
  };
}

const getOrderFormat = async () => {
  const url = 'order/format';
  const response = await v2Axios.get<ResponseGetOrderFormat>(url);

  return response.data;
};

/*
 * 발주서 양식 생성
 */

export interface RequestCreateOrderFormat {
  vendor_name: string[];
  vendor_address: string[];
  vendor_mobile: string[];
  product_name: string[];
  product_option: string[];
  product_count: string[];
  product_price: string[];
  order_type: string[];
  memo: string[];
}

export interface ResponseCreateOrderFormat {
  msg: string;
}

const createOrderFormat = async (data: RequestCreateOrderFormat) => {
  const url = 'order/format';
  const response = await v2Axios.post<ResponseCreateOrderFormat>(url, data);

  return response.data;
};

/*
 * 발주서 엑셀 파싱
 */

interface WholesalerMobile {
  id: number;
  phone: string;
}

interface WholesalerStore {
  id: number;
  name: string;
  address: string;
  mobiles: WholesalerMobile[];
}

export interface StoreOrder {
  vendor_name: string;
  vendor_address: string;
  vendor_mobile: string;
  product_id?: number;
  product_name: string;
  product_option: string;
  product_price: string;
  product_count: string;
  order_type: string;
  memo: string;

  ws_store_info: WholesalerStore[];
}

export interface StoreOrderItemExcelParsing {
  rt_store_id: number;
  rt_store_name: string;
  orders: StoreOrder[];
}

export interface RequestCreateOrderItemExcelParsing {
  files: RcFile[];
}

export interface ResponseCreateOrderItemExcelParsing {
  msg: string;
  data: {
    successes: StoreOrderItemExcelParsing[];
  };
}

const createOrderExcelParsing = async (
  data: RequestCreateOrderItemExcelParsing,
) => {
  const url = 'order/parsing';
  const formData = new FormData();
  data.files.map((file) => formData.append('files', file));
  const response = await v2Axios.post<ResponseCreateOrderItemExcelParsing>(
    url,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};

const orderAPI = {
  getList,
  get,
  getItem,
  create,
  getOrderFormat,
  createOrderFormat,
  createOrderExcelParsing,
};

export default orderAPI;
