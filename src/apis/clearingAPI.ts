import saveAs from 'file-saver';
import moment from 'moment';
import { v2Axios } from '.';

// 잔여 매입조정 금액
export interface BalanceShow {
  id: number;
  original_id: number;
  refund_amount: number;
  overpaid_amount: number;
  created_time: string;
  process_type: string;
  memo: string;
  vendor_info: {
    id: number;
    vendor_name: string;
    vendor_address: string;
    is_vat_included: boolean;
    ws_store_id: number;
  };

  // 거래처별 입고된 금액 프론트에서 계산해줌
  warehousing_amount?: number;
  // 차감할 금액
  subtract_price?: number;
}

export interface Balance {
  id: number;
  original_id: number;
  rt_store_id: number;
  process_type: 'warehousing' | 'adjustment' | 'reserve_payment';
  created_time: string;
  unpaid_amount: number;
  overpaid_amount: number;
  reserve_amount: number;
  vendor_info: {
    id: number;
    vendor_name: string;
  };
  // 당일 결제 공급가 합계
  clearing_amount: number;
  // 매입 결제 대기 최대 결제 가능 금액
  max_clearing_amount: number;
}

// 정산서
export interface ClearingSheetShow {
  id: number;
  created_time: string;
  status: 'request' | 'pending' | 'complete';
  store_id: number;
  store_name: string;
  request_date: string;
  complete_date: string | null;
  total_clearing_amount: number;
  total_deposit_amount: number;
  included_vat_amount: number;
}

// 정산 아이템
export interface ClearingItemShow {
  id: number;
  created_by: number;
  created_time: string;
  created_date: string;
  sheet_id: number;
  is_inactive: boolean;
  type: string;
  original_id: number;
  adjustment_type: string;
  adjustment_process_type: string;
  rt_store_id: number;
  rt_store_name: string;
  vendor_id: number;
  vendor_name: string;
  vendor_address: string;
  recipient_print: string;
  is_vat_included: boolean;
  bank: string;
  account_number: string;
  account_holder: string;
  memo: string | null;
  total_amount: number;
  clearing_amount: number;
  supply_amount: number;
  vat_amount: number;
  complete_date: string;
  ws_store_id: {
    id: number;
    store_phone: Array<{
      phone: string;
    }>;
  };
}

/*
 *   입고 결제 대기 거래처별 잔액 요청
 */

export interface RequestGetWarehousingBalance {
  tab: 'unpaid_vendor';
  rt_store_id: number;
}

export interface ResponseGetWarehousingBalance {
  msg: string;
  data: {
    item_list: Balance[];
    total_count: number;
  };
}

const getWarehousingBalance = async function (
  query: RequestGetWarehousingBalance,
) {
  let url = 'clearing/balance?';
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetWarehousingBalance>(url);
  return response.data.data;
};

/*
 *  매입조정 결제대기 거래처별 잔액 요청
 */
export interface RequestGetAdjustmentBalance {
  rt_store_id: number;
  vendor_id_list: number[];
}

export interface ResponseGetAdjustmentBalance {
  msg: string;
  data: {
    item_list: Balance[];
    total_count: number;
  };
}

const getAdjustmentBalance = async function (
  query: RequestGetAdjustmentBalance,
) {
  let url = `clearing/balance?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetAdjustmentBalance>(url);
  return response.data.data;
};

// Request: 정산서 생성
export interface RequestCreateSheet {
  store_id?: number;
  credit_type: 'general';
  store_name?: string;
}

// Response: 정산서 생성
export interface ResponseCreateSheet {
  msg: string;
  data: number;
}

// Request: 정산 상품 생성
export interface RequestCreateItem {
  sheet_id?: number;
  rt_store_id?: number;
  rt_store_name?: string;
  clearing_amount_list: {
    vendor_id: number;
    clearing_amount: number;
  }[];
  subtract_amount_list: {
    vendor_id: number;
    subtract_amount: number;
  }[];
  reserve_amount_list: {
    vendor_id: number;
    reserve_amount: number;
  }[];
}

// Response: 정산 상품 생성
export interface ResponseCreateItem {
  msg: string;
}

// 정산서 생성 요청
const create = async function (data: {
  sheet: RequestCreateSheet;
  item: RequestCreateItem;
}) {
  let url = 'clearing/sheet';
  const sheetResponse = await v2Axios.post<ResponseCreateSheet>(
    url,
    data.sheet,
  );
  url = 'clearing/item';
  const itemResponse = await v2Axios.post<ResponseCreateItem>(url, {
    ...data.item,
    sheet_id: sheetResponse.data.data,
  });
  return itemResponse.data;
};

// Request: 매입 결제대기 항목
export interface RequestGetBalance {
  // 매입조정 처리내역 확인할때
  rt_store_id?: number;
  vendor_id?: number;
  start_date?: string;
  end_date?: string;
  // 페이지 구분
  tab?: 'balance' | 'balance_detail' | 'adjustment';
  // 정산에서 매입차감 위해 조회할 때
  warehousing_sheet_id?: string;
  // 매입조정 상세 조회할 때
  original_id?: number;
}

// Response: 매입 결제대청 항목
export interface ResponseGetBalance {
  msg: string;
  data: {
    item_list: Array<BalanceShow>;
    total_count: number;
  };
}

// 매입 결제대기 항목 요청
const getBalance = async function (query: RequestGetBalance) {
  let url = 'clearing/balance?';
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetBalance>(url);
  return response.data;
};

// Request: 정산서 조회
export interface RequestGetSheet {
  store_id?: number;
  credit_type: 'general';
  date_filter?: 'request_date' | 'complete_date';
  start_date: string;
  end_date: string;
  page?: number;
  page_size?: number;
  status: string; // "request" | "pending" | "complete" | "all"
}

// Response: 정산서 조회
export interface ResponseGetSheet {
  msg: string;
  data: {
    sheet_list: ClearingSheetShow[];
    total_count: number;
    clearing_summary: {
      request: {
        count: number;
        amount: number;
      };
      pending: {
        count: number;
        amount: number;
      };
      complete: {
        count: number;
        amount: number;
      };
    };
  };
}

// 정산서 조회 요청
const getSheet = async function (query: RequestGetSheet) {
  let url = 'clearing/sheet?';
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetSheet>(url);
  return response.data;
};

// Request: 정산장 수정 요청
export interface RequestUpdateSheet {
  id: number;
  // 삭제 요청시 1
  is_inactive: number;
}

// Response: 정산장 수정
export interface ResponseUpdateSheet {
  msg: string;
  data: number;
}

// 정산장 수정 요청
const updateSheet = async function (data: RequestUpdateSheet) {
  let url = `clearing/sheet/${data.id}`;
  const response = await v2Axios.patch<ResponseUpdateSheet>(url, data);
  return response.data;
};

// Request: 정산 아이템 조회
export interface RequestGetItem {
  sheet_id: number;
  page_size: 100;
}

// Response: 정산 아이템 조회
export interface ResponseGetItem {
  msg: string;
  data: {
    item_list: Array<ClearingItemShow>;
    total_count: number;
  };
}

// 정산 아이템 조회 요청
const getItem = async function (query: RequestGetItem) {
  let url = 'clearing/item?';
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetItem>(url);
  return response.data;
};

interface RequestGetItemDetail {
  item_id: number;
}

interface ResponseGetItemDetail {
  msg: string;
  data: {
    item_list: Array<{
      vendor_name: string;
      vendor_address: string;
      bank: string;
      account_number: string;
      account_holder: string;
      deposit_price: number;
      supply_price: number;
      vat_price: number;
      clearing_type: string;
      memo: string;
    }>;
  };
}

const getItemDetail = async function (query: RequestGetItemDetail) {
  const url = `clearing/item/${query.item_id}`;
  const response = await v2Axios.get<ResponseGetItemDetail>(url);
  return response.data;
};

/*
 * 정산내역 다운로드
 */

interface RequestDownload {
  rt_store_id?: number;
  start_date: string;
  end_date: string;
}

const download = async function (query: RequestDownload) {
  let url = `excel/download/clearing?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get(url, { responseType: 'arraybuffer' });
  // 파일 저장
  saveAs(
    new Blob([response.data], { type: 'application/ms-excel' }),
    `${moment(query.start_date).format('YYMMDD')}_${moment(
      query.end_date,
    ).format('YYMMDD')}_정산내역.xlsx`,
  );
};

const clearingAPI = {
  getWarehousingBalance,
  getAdjustmentBalance,
  getBalance,
  create,
  getSheet,
  updateSheet,
  getItem,
  getItemDetail,
  download,
};

export default clearingAPI;
