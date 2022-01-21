import { mockAxios } from "./index";

export interface StoreAccount {
  bank: string;
  account_number: string;
  account_holder: string;
}

// Request: 거래처 버킷 리스트 생성
export interface RequestCreateBucketList {
  name: string;
  phone: string;
  store_phone: Array<string>;
  store_account: Array<StoreAccount>;
  building: string;
  floor: string;
  col: string;
  row: string;
  ext: string;
  type: "update" | "create";
  ws_store_id: number;
  memo: string;
  biz_name: string;
  biz_num: number;
}

// Response: 거래처 버킷 리스트 생성
export interface ResponseCreateBucketList {
  msg: string;
  data: null;
}

// 거래처 버킷 리스트 생성
const createBucketList = async function (data: RequestCreateBucketList) {
  const url = `v2/store_bucketlist`;
  const response = await mockAxios.post<ResponseCreateBucketList>(url, data);
  return response.data;
};

const bucketListAPI = {
  createBucketList,
};

export default bucketListAPI;
