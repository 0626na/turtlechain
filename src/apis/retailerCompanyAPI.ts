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

const retailerCompanyAPI = {
  create,
};

export default retailerCompanyAPI;
