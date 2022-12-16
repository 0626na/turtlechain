import { v2Axios } from '.';
import { RcFile } from 'antd/lib/upload';

export interface Company {
  id: number;
  biz_type: string;
  biz_num: string;
  name: string;
  type: number;
  email: string[];
  address: string;
  memo: string;
  owner: string;
  biz_license_path: string;
}

/*
 *  사업자 정보
 */

interface RequestGet {
  company_id: number;
}

interface ResponseGet {
  msg: string;
  data: Company;
}

const get = async (params: RequestGet) => {
  const url = `/provisioning/retailer/companies/${params.company_id}`;
  const response = await v2Axios.get<ResponseGet>(url);

  return response.data.data;
};

/*
 * 사업자 정보 수정
 */

interface RequestUpdate {
  company_id?: string;
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

const update = async (data: RequestUpdate) => {
  const url = `/provisioning/retailer/companies/${data.company_id}`;
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  !data.biz_license_file && formData.delete('biz_license_file');
  const response = await v2Axios.patch<ResponseUpdate>(url, formData);

  return response.data;
};

// 사업자 정보 이메일 유효성 검사

interface requestCheckEmailValidity {
  email: string;
}

interface ResponseCheckEmailValidity {
  msg: string;
  data: null;
}

const checkEmailValidity = async (params: requestCheckEmailValidity) => {
  const url = `/provisioning/retailer/companies/email-validation`;
  const response = await v2Axios.get<ResponseCheckEmailValidity>(url, {
    params,
  });

  return response.data;
};

const retailerCompanyAPI = {
  get,
  update,
  checkEmailValidity,
};

export default retailerCompanyAPI;
