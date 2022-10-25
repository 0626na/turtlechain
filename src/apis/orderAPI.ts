import { RcFile } from 'antd/lib/upload';
import { v2Axios } from '.';

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
  order_id?: number;
  vendor_name: string;
  vendor_address: string;
  vendor_mobile: string;
  mobile: string;
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
    fails: StoreOrderItemExcelParsing[];
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

/*
 * 발주 등록 여부 확인 (프리파싱)
 * 발주 등록은 쇼핑몰당 하루 2회 가능하다.
 */

interface PreParsingOrder {
  rt_store_id: number;
  rt_store_name: string;
}

export interface PreParsingOrderList {
  first_order: PreParsingOrder[];
  second_order: PreParsingOrder[];
  third_order: PreParsingOrder[];
}

export interface RequestCreatePreParsing {
  files: RcFile[];
}

export interface ResponseCreatePreParsing {
  msg: string;
  data: PreParsingOrderList;
}

const createPreParsing = async (data: RequestCreatePreParsing) => {
  let url = 'order/parsing/pre-parsing';
  let parsingResponse;
  const formData = new FormData();
  data.files.map((file) => formData.append('files', file));

  const preParsingResponse = await v2Axios.post<ResponseCreatePreParsing>(
    url,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  if (preParsingResponse.data.data.third_order.length === 0) {
    url = 'order/parsing';
    parsingResponse = await v2Axios.post<ResponseCreateOrderItemExcelParsing>(
      url,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  }

  return {
    files: data.files,
    preParsingResult: preParsingResponse.data,
    parsingData: parsingResponse?.data,
  };
};

/*
 * 발주 등록
 */

export interface CreatingOrdersItem {
  vendor_name: string;
  vendor_address: string;
  vendor_mobile: string;
  mobile: string;
  product_name: string;
  product_option: string;
  product_count: number;
  product_price: number;
  order_type: string;
  memo: string;
  ws_store_id: number | null;
}

export interface OrderItemList {
  rt_store_id: number;
  orders: CreatingOrdersItem[];
}

export interface RequestCreateOrderItem {
  rt_stores: OrderItemList[];
}

export interface ResponseCreateOrderItem {
  msg: string;
}

const createOrderItem = async (data: RequestCreateOrderItem) => {
  const url = 'order/item';
  const response = await v2Axios.post<ResponseCreateOrderItem>(url, data);

  return response.data;
};

/*
 * 발주내역 조회
 */

export interface OrderSheetList {
  id: number;
  rt_store_name: string; //쇼핑몰명
  is_inactive: boolean; //삭제여부
  created_time: string;
  total_store_count: number;
  order_price: number; //주문총액
  type: 'new' | 'modify'; //1차: new, 2차: modify
}

export interface RequestGetOrderSheet {
  //rt_store_id: number;
  start_date: string;
  end_date: string;
}

export interface ResponseGetOrderSheet {
  msg: string;
  data: {
    order_sheet_list: OrderSheetList[];
  };
}

const getOrderSheets = async (params: RequestGetOrderSheet) => {
  const url = 'order/sheet';
  const response = await v2Axios.get<ResponseGetOrderSheet>(url, { params });

  return response.data;
};

/*
 *  발주내역 상세조회
 */

export interface OrderHistoryItem {
  ws_store_id: number; //도매 ID
  vendor_name: string; //거래처명
  address: string; //거래처주소
  mobile: string;
  name: string; //상품명
  option: string;
  type: string; //분류
  count: number; //요청수량
  price: number; //공급가
  memo: string;
}

export interface OrderHistorySheet {
  rt_store_id: number;
  rt_store_name: string;
  created_time: string;
  total_store_count: number;
  total_item_subcount: number;
  total_price: number;
  total_item_count: number;
}

export interface RequestGetOrderItem {
  sheet_id: number;
}

export interface ResponseGetOrderItem {
  msg: string;
  data: {
    successes: OrderHistoryItem[];
    fails: OrderHistoryItem[];
    order_sheet: OrderHistorySheet;
  };
}

const getOrderHistory = async (params: RequestGetOrderItem) => {
  const url = 'order/item';
  const response = await v2Axios.get<ResponseGetOrderItem>(url, { params });

  return response.data;
};

/*
 * 사입삼촌 쇼핑몰 검색
 */

export interface PickerStore {
  id: number;
  name: string;
  store_phone: {
    phone: string;
  }[];
}

export interface ResponseGetPickerStores {
  msg: string;
  data: {
    store_list: PickerStore[];
    total_count: number;
  };
}

const getPickerStores = async () => {
  const url = 'provisioning/picker/stores';
  const response = await v2Axios.get<ResponseGetPickerStores>(url);

  return response.data;
};

/*
 * 발주 단건추가
 */

export interface RequestCreateStore {
  rt_store_id: string;
  name: string;
  store_mobile: {
    send_alimtalk: boolean;
    mobile: string;
    tag: string;
  };
}

export interface ResponseGetRetailerStores {
  msg: string;
}

const createSingleStore = async (data: RequestCreateStore) => {
  const url = 'provisioning/picker/stores';
  const response = await v2Axios.post<ResponseGetRetailerStores>(url, data);

  return response.data;
};

const orderAPI = {
  getOrderFormat,
  createOrderFormat,
  createOrderExcelParsing,
  createOrderItem,
  getOrderSheets,
  createPreParsing,
  getOrderHistory,
  createSingleStore,
  getPickerStores,
};

export default orderAPI;
