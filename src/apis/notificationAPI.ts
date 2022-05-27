import { v2Axios } from "apis";
import { TOKEN } from "constant";

export interface RequestGet {
  type: "home" | "setting";
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
        name: string;
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
const get = async function (query: RequestGet) {
  let url = "notification?";
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGet>(url, {
    headers: {
      Authorization: `JWT ${sessionStorage.getItem(TOKEN)}`,
    },
  });
  return response.data.data;
};

interface RequestUpdate {
  id: number;
}

interface ResponseUpdate {
  msg: string;
}
const update = async function (data: RequestUpdate) {
  const url = `notification/${data.id}`;
  const response = await v2Axios.patch<ResponseUpdate>(url, data);
  return response.data;
};

const notificationAPI = {
  get,
  update,
};

export default notificationAPI;
