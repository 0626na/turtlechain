import { v2Axios } from '@apis/index';
import { StoreShow } from './retailerStoreAPI';

/*
 * picker 쇼핑몰 리스트
 */

export interface ResponseGetList {
  msg: string;
  data: {
    store_list: StoreShow[];
    total_count: number;
  };
}

const getList = async () => {
  const url = 'provisioning/picker/stores';
  const response = await v2Axios.get<ResponseGetList>(url);

  return response.data;
};

/*
 * picker 쇼핑몰 등록
 */

export interface RequestCreateStore {
  rt_store_id: string;
  name: string;
  store_url: string;
  store_mobile: {
    send_alimtalk: boolean;
    mobile: string;
    tag: string;
  };
}

export interface ResponseCreateStore {
  msg: string;
  data: null;
}

const create = async (data: RequestCreateStore) => {
  const url = 'provisioning/picker/stores';
  const response = await v2Axios.post<ResponseCreateStore>(url, data);

  return response.data;
};

export interface ResponseRemoveStore {
  msg: string;
}

const remove = async (storeId: number) => {
  const url = `provisioning/picker/stores/${storeId}`;
  const response = await v2Axios.delete<ResponseRemoveStore>(url);

  return response.data;
};

const pickerAPI = {
  getList,
  create,
  remove,
};

export default pickerAPI;
