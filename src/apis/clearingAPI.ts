import saveAs from 'file-saver';
import moment from 'moment';
import { v2Axios } from '.';
import { RcFile } from 'antd/lib/upload';

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

export interface ClearingInfo {
  vendor_info: {
    id: number;
    created_time: string;
    vendor_name: string;
    vendor_address?: string;
  };
  rt_store_id: number;
  created_date: string;
  memo?: string;

  warehousing_amount: number; // 당일 입고 금액
  unpaid_amount: number; // 미결제 잔액
  overpaid_amount: number; // 남은돈 | 사용 가능 금액 | 차감가능 금액

  refund_amount: number; // 받을 돈 | 환불 금액
  reserve_payment_amount: number; // 미송 결제 금액(미송 등록 시 생성)
  reserve_subtract_amount: number; // 미송 차감 금액 (미송 입고 시 생성)

  // client State
  type:
    | 'warehousing'
    | 'adjustment_subtract'
    | 'reserve_subtract'
    | 'reserve_payment';
  overpaid_payment_amount?: number; // 남은돈 | 사용 가능 금액 | 차감가능 금액 중 사용할 금액 입력
  clearing_amount?: number; // 당일 결제요청 금액 : 미결제 금액 + 입고금액  + 미송결제금액 - 사용할 금액(사용자 입력시 or 전액결제 버튼누를시 overpaid_mount로 대체)
  clearing_payment_amount?: number; // 당일 결제예정 금액(사용자 입력)
}

export interface RequestGetClearing {
  rt_store_id: number;
  balance_type: 'clearing';
}

export interface ResponseGetClearing {
  msg: string;
  data: {
    item_list: ClearingInfo[];
  };
}

// 결제하기
const getClearing = async (params: RequestGetClearing) => {
  const url = `clearing/balance`;
  const response = await v2Axios.get<ResponseGetClearing>(url, { params });

  return response.data.data;
};

// Request: 정산서 생성
export interface RequestCreateSheet {
  store_id?: number;
  credit_type: 'general';
  store_name?: string;
  request_date: string;
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

/*
 * 받을돈 / 사용할돈
 */

// 리스트
export interface RequestGetOverpaidBalanceList {
  rt_store_id: number;
  balance_type: 'balance';

  start_date?: string;
  end_date?: string;

  vendor_id?: number;
  subtract_amount?: number;
  refund_amount?: number;
}

export interface ResponseGetOverpaidBalanceList {
  msg: string;
  data: {
    item_list: ClearingInfo[];
  };
}

const getOverpaidBalanceList = async (
  params: RequestGetOverpaidBalanceList,
) => {
  const url = `clearing/balance`;
  const response = await v2Axios.get<ResponseGetClearing>(url, { params });

  return response.data.data;
};

// 상세
export interface RequestGetOverpaidBalance {
  rt_store_id: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD

  vendor_id: number;

  subtract_amount: number; // 남은돈
  //overpaid_amount: number;
  refund_amount: number; // 받을돈
}

export interface ResponseGetOverpaidBalance {
  msg: string;
  data: {
    item_list: ClearingInfo[];
  };
}

const getOverpaidBalance = async (params: RequestGetOverpaidBalance) => {
  const url = `clearing/balance/${params.vendor_id}`;
  const response = await v2Axios.get<ResponseGetClearing>(url, { params });

  return response.data.data;
};

/*
 *  정산서 조회
 */

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

const getSheet = async function (query: RequestGetSheet) {
  let url = 'clearing/sheet?';
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetSheet>(url);
  return response.data;
};

/*
 *  정산장 수정 요청
 */

export interface RequestUpdateSheet {
  id: number;
  // 삭제 요청시 1
  is_inactive: number;
}

export interface ResponseUpdateSheet {
  msg: string;
  data: number;
}

const updateSheet = async function (data: RequestUpdateSheet) {
  let url = `clearing/sheet/${data.id}`;
  const response = await v2Axios.patch<ResponseUpdateSheet>(url, data);
  return response.data;
};

/*
 * 정산 아이템 조회
 */

export interface RequestGetItem {
  sheet_id: number;
  page_size: 100;
}

export interface ResponseGetItem {
  msg: string;
  data: {
    item_list: Array<ClearingItemShow>;
    total_count: number;
  };
}

const getItem = async function (query: RequestGetItem) {
  let url = 'clearing/item?';
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetItem>(url);

  return response.data;
};

/*
 *  정산 아이템 상세 조회
 */

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

/*
 *  정산서 파싱
 */

export interface ClearingItemParse {
  ws_store_name: string;
  vendor_address: string;
  bank: string;
  account_number: string;
  account_holder: string;
  credit_amount: number;
  recipient_print: string;
  is_vat_included: boolean;
}

export interface RequestParseExcel {
  files: RcFile;
  rt_store_id: number;
}

export interface ResponseParseExcel {
  msg: string;
  data: {
    success: ClearingItemParse[];
    fail: ClearingItemParse[];
    count: {
      success_count: number;
      fail_count: number;
    };
  };
}

const parseExcel = async (data: RequestParseExcel) => {
  const url = `excel/clearing`;
  const formData = new FormData();
  formData.append('files', data.files);
  formData.append('rt_store_id', `${data.rt_store_id}`);
  const response = await v2Axios.post<ResponseParseExcel>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

/*
 * 정산서 엑셀등록
 */

export interface RequestCreateParse {
  store_id: number;
  store_name: string;
  total_clearing_amount: number;
  credit_type: 'general';
  request_date: string;
  clearing_add_request: ClearingItemParse[];
}

export interface ResponseCreateParse {
  msg: string;
  data: {};
}

const createParse = async (data: RequestCreateParse) => {
  const url = `clearing/credit_group`;
  const response = await v2Axios.post<ResponseCreateParse>(url, data);

  return response.data.data;
};

const clearingAPI = {
  getClearing,
  getOverpaidBalanceList,
  getOverpaidBalance,
  create,
  getSheet,
  updateSheet,
  getItem,
  getItemDetail,
  download,
  parseExcel,
  createParse,
};

export default clearingAPI;
