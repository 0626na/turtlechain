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
      biz_type: string;
      biz_num: string;
      name: string;
      type: number;
      address: string;
      memo: string;
      owner: string;
    }>;
  };
}
const get = async function () {
  const url = `/provisioning/retailer_company?search_type&search_query=&last_id=-1&switch_type=next&offset=100`;
  const response = await v2Axios.get<ResponseGet>(url);
  return response.data.data.data[0];
};

const retailerCompanyAPI = {
  create,
  get,
};

export default retailerCompanyAPI;
