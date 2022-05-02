import { RcFile } from "antd/lib/upload";
import { v2Axios } from "apis";

// 소매 사업자 생성
interface RequestCreate {
  biz_type: "personal" | "entity" | "simple";
  owner: string;
  name: string;
  biz_num: string;
  address_main: string;
  address_sub: string;
  biz_license_file: File;
  memo: string;
}

interface ResponseCreate {
  data: {
    company_id: number;
  };
}

const create = async function (data: RequestCreate) {
  const url = "/provisioning/retailer_company";
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }

  const response = await v2Axios.post<ResponseCreate>(url, formData);
  return response.data.data;
};

interface ResponseGet {
  msg: string;
  data: {
    data: Array<{
      id: number;
      biz_type: string;
      biz_num: string;
      name: string;
      type: number;
      email: string;
      address: string;
      memo: string;
      owner: string;
      biz_license_path: string;
    }>;
  };
}
const get = async function () {
  const url = `/provisioning/retailer_company?search_type&search_query=&last_id=-1&switch_type=next&offset=100`;
  const response = await v2Axios.get<ResponseGet>(url);
  return response.data.data.data[0];
};

interface RequestUpdate {
  company_id?: number;
  biz_type: string;
  name: string;
  address_main: string;
  address_sub: string;
  email: string;
  memo: string;
  biz_license_file: RcFile;
}

interface ResponseUpdate {
  msg: string;
}

const update = async function (data: RequestUpdate) {
  const url = `/provisioning/retailer_company/${data.company_id}`;
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  !data.biz_license_file && formData.delete("biz_license_file");
  const response = await v2Axios.patch<ResponseUpdate>(url, formData);
  return response.data;
};

const retailerCompanyAPI = {
  create,
  get,
  update,
};

export default retailerCompanyAPI;
