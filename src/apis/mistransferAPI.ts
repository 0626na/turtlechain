import { v2Axios } from '.';

export interface RequestCreate {
  refund_amt: number;
  ws_store_id: number;
  rt_store_id: number;
  recipient_print: string;
  is_vat_included: boolean;
  clearing_item_id: number;
  memo: string;
}

export interface ResponseCreate {}

const create = async (data: RequestCreate) => {
  const url = '/mistransfer/items';
  const response = await v2Axios.post<ResponseCreate>(url, data);

  return response.data;
};

export interface RequestGet {
  rt_store_id?: number;
  type: 'mistransfer';
}

export interface RefundItem {
  id: number;
  status: 'request' | 'complete' | 'pending';
  created_date: string;
  complete_date: string;
  ws_store_name: string;
  ws_bank: string;
  ws_account_number: string;
  ws_account_holder: string;
  transfer_amount: number;
  recipient_print: string;
  memo: string;
}
export interface ResponseGet {
  msg: string;
  data: {
    refund_list: Array<RefundItem>;
    total_count: number;
  };
}

const get = async (params: RequestGet) => {
  const url = `/mistransfer/items`;
  const response = await v2Axios.get<ResponseGet>(url, { params });

  return response.data;
};

export interface RequestUpdate {
  item_id: number;
  // 삭제 요청시 1
  is_inactive: number;
}

export interface ResponseUpdate {}

const update = async function (data: RequestUpdate) {
  const url = `mistransfer/items/${data.item_id}`;
  const response = await v2Axios.patch<ResponseUpdate>(url, data);
  return response.data;
};

const mistransferAPI = {
  create,
  get,
  update,
};

export default mistransferAPI;
