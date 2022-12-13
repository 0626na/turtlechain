import { v2Axios } from '@apis/index';

export interface WholesalerStore {
  id: number;
  name: string;
  building: string;
  floor: string;
  col: string;
  loc: string;
  ext: string;
  phone: string;
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
  search_type: string;
  search_string: string;
  page: number;
  page_size: number;
}

export interface ResponseGetList {
  msg: string;
  data: {
    store_list: WholesalerStore[];
    total_count: number;
  };
}

export interface RequestGet {
  storeId: number;
}

export interface ResponseGet {
  msg: string;
  data: WholesalerStore;
}

const getList = async (params: RequestGetList) => {
  const url = 'provisioning/wholesaler/stores';
  const response = await v2Axios.get<ResponseGetList>(url, { params });

  return response.data;
};

const get = async (params: RequestGet) => {
  const url = `provisioning/wholesaler/stores/${params.storeId}`;
  const response = await v2Axios.get<ResponseGet>(url);

  return response.data;
};

const wholesalerAPI = {
  getList,
  get,
};

export default wholesalerAPI;
