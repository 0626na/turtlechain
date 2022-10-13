import { v2Axios } from '@apis/index';

interface WholesalerStore {
  id: number;
  name: string;
  building: string;
  floor: string;
  col: string;
  lc: string;
  ext: string;
  store_phone: {
    phone: string;
  }[];
  store_account: {
    id: number;
    account_number: string;
    account_holder: string;
    bank: string;
  }[];
  memo: string;
}

export interface RequestGetList {
  page: number;
}

export interface ResponseGetList {
  msg: string;
  data: {
    store_list: WholesalerStore[];
    total_count: number;
  };
}

const getList = async (params: RequestGetList) => {
  const url = 'provisioning/wholesaler/stores';
  const response = await v2Axios.get<ResponseGetList>(url, { params });
  return response.data;
};

const wholesalerAPI = {
  getList,
};

export default wholesalerAPI;
