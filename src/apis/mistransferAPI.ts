import { v2Axios } from "apis";

export interface RequestCreate {
  refund_amt: number;
  ws_store_id: number;
  rt_store_id: number;
  recipient_print: string;
  is_vat_included: boolean;
  clearing_item_id: number;
}

export interface ResponseCreate {}

const create = async function (data: RequestCreate) {
  const url = "/mistransfer/items";
  const response = await v2Axios.post<ResponseCreate>(url, data);
  return response.data;
};

export interface RequestGet {
  rt_store_id?: number;
  start_date: string;
  end_date: string;
  type: "mistransfer";
}

export interface ResponseGet {
  msg: string;
  data: {
    refund_list: Array<{
      id: number;
      status: string;
      created_date: string;
      complete_date: string;
      ws_store_name: string;
      ws_bank: string;
      ws_account_number: string;
      ws_account_holder: string;
      deposit_price: number;
      recipient_print: string;
    }>;
    total_count: number;
  };
}

const get = async function (query: RequestGet) {
  let url = `/mistransfer/items?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGet>(url);
  return response.data;
};

const mistransferAPI = {
  create,
  get,
};

export default mistransferAPI;
