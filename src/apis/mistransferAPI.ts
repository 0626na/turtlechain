import { v2Axios } from "apis";

export interface RequestCreate {
  reufund_amt: number;
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

const mistransferAPI = {
  create,
};

export default mistransferAPI;
