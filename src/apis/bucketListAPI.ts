import { v2Axios } from "./index";
import { VendorAccount } from "./vendorAPI";

// Request: 거래처 버킷 리스트 생성
export interface RequestCreate {
  type: "update" | "create";
  name: string;
  tel: string;
  mobile: string;
  banks: Array<VendorAccount>;
  building: string;
  floor: string;
  col: string;
  loc: string;
  colLoc?: string;
  ext: string;
  memo: string;
  biz_name: string;
  biz_num: number;
  biz_owner: string;
}

// Response: 거래처 버킷 리스트 생성
export interface ResponseCreate {
  msg: string;
  data: null;
}

// 거래처 버킷 리스트 생성
const create = async function (data: RequestCreate) {
  const url = `provisioning/store-bucketlist`;
  const response = await v2Axios.post<ResponseCreate>(url, data);
  return response.data;
};

const bucketListAPI = {
  create,
};

export default bucketListAPI;
