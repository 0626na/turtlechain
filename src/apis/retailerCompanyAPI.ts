import { v2Axios } from '.';
import { RcFile } from 'antd/lib/upload';

/*
 *  사업자 정보
 */

interface ResponseGet {
  msg: string;
  data: {
    company_list: Array<{
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
  const url = `/provisioning/retailer/companies`;
  const response = await v2Axios.get<ResponseGet>(url);
  return response.data.data.company_list[0];
};

/*
 * 사업자 정보 수정
 */

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
  !data.biz_license_file && formData.delete('biz_license_file');
  const response = await v2Axios.patch<ResponseUpdate>(url, formData);
  return response.data;
};

const retailerCompanyAPI = {
  get,
  update,
};

export default retailerCompanyAPI;
