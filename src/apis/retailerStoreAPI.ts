import { v2Axios } from '.';

export interface Store {
  name: string;
  email: string;
  store_url: string;
  alimtalk_name: string;
  store_account: {
    bank: string;
    account_number: string;
    account_holder: string;
  };
  store_mobile: {
    send_alimtalk: boolean;
    mobile: string;
    tag: string;
  };
  // 1: 셀메이트, 2: 이지어드민, 3: 터틀체인
  inventory_type: number;
  inventory_domain: string;
  inventory_key: string;
  inventory_is_vat_included: boolean;
}

export interface StoreShow {
  id: number;
  name: string;
  store_url: string;
  inventory_type: number;
  inventory_domain: string;
  inventory_key: string;
  inventory_is_vat_included: boolean;
  alimtalk_name: string;
  is_closed: boolean;
  order_formats: number;
  email: string;
  sender_name: string;
  store_account: Array<{
    id: number;
    bank: string;
    account_number: string;
    account_holder: string;
  }>;
  store_phone: {
    phone: string;
  }[];
}

// 쇼핑몰 리스트 가져오기
export interface ResponseGetList {
  data: {
    total_count: number;
    store_list: Array<StoreShow>;
  };
}

const getList = async function () {
  let url = '/provisioning/retailer/stores';
  const response = await v2Axios.get<ResponseGetList>(url);
  return response.data.data;
};

// 개별 쇼핑몰 가져오기
export interface RequestGet {
  store_id: number;
}

export interface ResponseGet {
  data: StoreShow;
}

const get = async function (data: RequestGet) {
  let url = `/provisioning/retailer_store/${data.store_id}`;
  const response = await v2Axios.get<ResponseGet>(url);
  return response.data;
};

// 수정하기
export interface RequestUpdate {
  store_id?: number;
  name: string;
  email: string;
  store_url: string;
  alimtalk_name: string;
  inventory_is_vat_included: boolean;
  is_closed: boolean;
  store_account: {
    bank: string;
    account_number: string;
    account_holder: string;
  };
  store_mobile: {
    mobile: string;
  };
  inventory_type: number;
  inventory_domain: string;
  inventory_key: string;
}

export interface ResponseUpdate {
  data: null;
}

const update = async function (data: RequestUpdate) {
  let url = `/provisioning/retailer_store/${data.store_id}`;
  delete data.store_id;
  const response = await v2Axios.patch<ResponseUpdate>(url, data);
  return response.data;
};

// 추가하기
export interface RequestCreate extends Store {}

export interface ResponseCreate {
  data: null;
}

const create = async function (data: RequestCreate) {
  let url = `/provisioning/retailer/stores`;
  const response = await v2Axios.post<ResponseCreate>(url, data);
  return response.data;
};

const retailerStoreAPI = {
  getList,
  get,
  update,
  create,
};

export default retailerStoreAPI;
