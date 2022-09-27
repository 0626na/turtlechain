import { v2Axios } from '.';

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
 *  거래장부 조회
 */

export interface RequestGetList {
  rt_store_id: number;
}

export interface ResponseGetList {
  msg: string;
  data: {
    vendor_name: string;
    vendor_address: string;
    unpaid_amount: number; // 결제요청금액
    subtract_amount: number; // 사용가능금액
    refund_amount: number; // 환불 예정금액
  };
}

const getList = async (params: RequestGetList) => {
  const url = 'accounting/transactions';
  const response = await v2Axios.get<ResponseGetList>(url, { params });

  return response.data;
};

//거래장부 상세 조회

interface RequestGetItem {
  vendor_id: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // // YYYY-MM-DD
}

interface ResponseGetItem {
  msg: string;
  data: {
    created_date: string;
    transaction_type: string; //
    memo: string;
    unpaid_amount: number;
    subtract_amount: number;
    refund_amount: number;
  }[];
}

const getItem = async (params: RequestGetItem) => {
  const url = `accounting/transactions/${params.vendor_id}`;
  const response = await v2Axios.get<ResponseGetItem>(url, { params });

  return response.data;
};

//거래장부 등록

interface RequestCreateItem {
  rt_store_id: number;
  vendor_id: number;
  subtract_amount: number; // 사용할 금액
  unpaid_amount: number; // 미결제 금액
}

interface ResponseCreateItem {
  msg: string;
  data: null;
}

const createItem = async (data: RequestCreateItem) => {
  const url = `accounting/transactions`;
  const response = await v2Axios.post<ResponseCreateItem>(url, { data });

  return response.data;
};

const transactionAPI = {
  getList,
  getItem,
  createItem,
};

export default transactionAPI;
