import { v2Axios } from '.';

export interface RequestGet {
  type: 'home' | 'setting';
  page?: number;
}

export interface ResponseGet {
  msg: string;
  data: {
    notification_list: Array<{
      id: number;
      created_time: string;
      read_at?: string;
      type: string;
      content: {
        vendor_name: string;
        store_id: number;
        component: string;
        before: string;
        after: string;
        status: string;
        memo: string;
      };
    }>;
  };
}

// 알림 조회
const get = async (params: RequestGet) => {
  const url = 'notification';
  const response = await v2Axios.get<ResponseGet>(url, { params });

  return response.data.data;
};

interface RequestUpdate {
  id: number;
}

interface ResponseUpdate {
  msg: string;
}

const update = async (data: RequestUpdate) => {
  const url = `notification/${data.id}`;
  const response = await v2Axios.patch<ResponseUpdate>(url, data);

  return response.data;
};

const notificationAPI = {
  get,
  update,
};

export default notificationAPI;
