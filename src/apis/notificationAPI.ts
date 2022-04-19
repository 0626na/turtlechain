import { v2Axios } from "apis";
import { TOKEN } from "constant";

export interface RequestGet {
  type: "home" | "setting";
  page?: number;
}

export interface ResponseGet {
  list: Array<{
    id: number;
    created_time: string;
    read_at: string;
    content: {
      name: string;
      store_id: number;
      component: string;
      before: string;
      after: string;
    };
  }>;
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
  return response.data;
};

const notificationAPI = {
  get,
};

export default notificationAPI;
