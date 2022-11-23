import { RcFile } from 'antd/lib/upload';
import { v2Axios } from '.';

/*
 * 발주기능에 관한 API 명세 및 목록파일 입니다.
 * 발주에 관한 모든 API는 이 파일에 작성해주세요.
 */

/**
 * 여기서 부터 발주서 헤더설정에 관한 인터페이스 및 함수입니다.
 */

/**
 * 발주서 양식 조회 (발주서 설정 modal) response 인터페이스
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

/**
 * 발주서 양식 조회 (발주서 설정 modal)
 * @returns 조회한 발주서 양식(헤더) 데이터 오브젝트
 */
const getOrderFormat = async () => {
  const url = 'order/format';
  const response = await v2Axios.get<ResponseGetOrderFormat>(url);

  return response.data;
};

/**
 * 발주서 헤더 설정 요청 인터페이스
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

/**
 * 발주서 헤더 설정 결과 인터페이스
 */
export interface ResponseCreateOrderFormat {
  msg: string;
}

/**
 * 발주서 헤더 설정 함수
 * @param data 생성 및 수정 하려는 발주서 헤더 양식 데이터
 * @returns 결과 메세지
 */
const createOrderFormat = async (data: RequestCreateOrderFormat) => {
  const url = 'order/format';
  const response = await v2Axios.post<ResponseCreateOrderFormat>(url, data);

  return response.data;
};

/*
 * 여기서부터 발주서 파싱 관련 인터페이스 및 함수입니다.
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

/**
 * 발주 데이터 인터페이스
 */
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
  creation_type: 'excel' | 'single';
  memo: string;

  ws_store_info: WholesalerStore[];
}

export interface StoreOrderItemExcelParsing {
  id?: number;
  rt_store_id: number;
  rt_store_name: string;
  type: 'excel' | 'single';
  orders: StoreOrder[];
}

/**
 * 발주서 파싱 결과의 데이터 인터페이스, 파싱에 성공/실패 갯수와 실패의 경우의 설명 메세지가 있다.
 */
export interface ParsingStatus {
  success_count: number;
  fail_count: number;
  error_messages: string[];
}

/**
 * 파싱하려는 발주서 파일 (엑셀파일) 인터페이스
 */
export interface RequestCreateOrderItemExcelParsing {
  files: RcFile[];
}

export interface ResponseCreateOrderItemExcelParsing {
  msg: string;
  data: {
    successes: StoreOrderItemExcelParsing[];
    fails: StoreOrderItemExcelParsing[];
    parsing_status: ParsingStatus;
  };
}

/**
 * ㄴㅇㄹㄴㅇㄹㅇㄴㄹ
 * @param data
 * @returns
 */
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
 * 여기서부터 발주 등록 여부 확인 (프리파싱) 관련 인터페이스 및 함수입니다.
 *
 */

/**
 * 발주서 프리파싱 인터페이스
 */
interface PreParsingOrder {
  rt_store_id: number;
  rt_store_name: string;
}

/**
 * 발주서 프리파싱 결과 데이터 인터페이스
 *
 * 발주는 쇼핑몰당 하루 2회 가능하다. 2회를 넘기면 금일은 발주가 불가능 하다.
 * first_order는 한번도 안한 경우, second_order는 두번째인 경우, third_order는 이미 횟수를 넘긴 발주서가 들어간다.
 */
export interface PreParsingOrderList {
  first_order: PreParsingOrder[];
  second_order: PreParsingOrder[];
  third_order: PreParsingOrder[];
}

/**
 * 프리파싱에 필요한 발주서 엑셀 파일 인터페이스
 */
export interface RequestCreatePreParsing {
  files: RcFile[];
}

/**
 * 프리파싱 결과 인터페이스
 */
export interface ResponseCreatePreParsing {
  msg: string;
  data: PreParsingOrderList;
}

/**
 * 발주서 프리파싱 함수
 * @constructor sdfsdf
 * @param {RequestCreatePreParsing} data 프리파싱에 필요한 발주서 파일
 * @returns 프리파싱 결과 데이터
 */
export const createPreParsing = async function (data: RequestCreatePreParsing) {
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
 * 여기서부터 발주등록 관련 인터페이스 및 함수 목록입니다.
 */

/**
 * 발주데이터 인터페이스
 */
export interface CreatingOrdersItem {
  vendor_name: string;
  vendor_address: string;
  vendor_mobile: string;
  mobile: string;
  product_name: string;
  product_option: string;
  product_count: number;
  creation_type: 'excel' | 'single';
  product_price: number;
  order_type: string;
  memo: string;
  ws_store_id: number | null;
}

/**
 * 발주데이터 리스트 인터페이스. 쇼핑몰마다 발주리스트를 가진다.
 */
export interface OrderItemList {
  rt_store_id: number;
  orders: CreatingOrdersItem[];
}

/**
 * 발주등록 요청 인터페이스.
 *
 * 발주하려는 데이터들이다.
 */
export interface RequestCreateOrderItem {
  rt_stores: OrderItemList[];
}

/**
 * 발주등록 결과 인터페이스
 */
export interface ResponseCreateOrderItem {
  msg: string;
}

/**
 * 발주등록 함수
 * @param data 등록하려는 발주데이터
 * @returns 등록결과 메세지
 */
const createOrderItem = async (data: RequestCreateOrderItem) => {
  const url = 'order/item';
  const response = await v2Axios.post<ResponseCreateOrderItem>(url, data);

  return response.data;
};

/*
 * 발주내역 조회
 */

/**
 *
 */
export interface OrderSheetList {
  id: number;
  rt_store_name: string; //쇼핑몰명
  is_inactive: boolean; //삭제여부
  created_time: string;
  fails: number; //실패수량
  total_store_count: number;
  total_success_count: number; //총 성공 건수
  total_fail_count: number; //총 실패 건수
  total_success_price: number; //총 성공 금액
  total_fail_price: number; //총 실패 금액
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
  total_success_count: number;
  total_item_subcount: number;
  total_success_price: number;
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
