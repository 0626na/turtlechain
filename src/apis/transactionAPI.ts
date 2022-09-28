import { v2Axios } from '.';

export interface TransactionDetailItem {
  id?: number;
  created_date: string;
  transaction_type: string;
  memo: string;
  unpaid_amount: number;
  subtract_amount: number;
  refund_amount: number;
}

export interface TransactionItem {
  vendor_id: number;
  vendor_name: string;
  vendor_address: string;
  unpaid_amount: number; // 결제요청금액
  subtract_amount: number; // 사용가능금액
  refund_amount: number; // 환불 예정금액
}

/*
 *  거래장부 조회
 */

export interface RequestGetList {
  rt_store_id: number | undefined;
}

export interface ResponseGetList {
  msg: string;
  data: TransactionItem[];
}

const getList = async (params: RequestGetList) => {
  const url = 'accounting/transactions';
  const response = await v2Axios.get<ResponseGetList>(url, { params });

  return response.data;
};

//거래장부 상세 조회

export interface RequestGetItem {
  vendor_id: number | undefined;
  start_date: string; // YYYY-MM-DD
  end_date: string; // // YYYY-MM-DD
}

interface ResponseGetItem {
  msg: string;
  data: TransactionDetailItem[];
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

const create = async (data: RequestCreateItem) => {
  const url = `accounting/transactions`;
  const response = await v2Axios.post<ResponseCreateItem>(url, data);

  return response.data;
};

const transactionAPI = {
  getList,
  getItem,
  create,
};

export default transactionAPI;
