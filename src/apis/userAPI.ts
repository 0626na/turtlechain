import { v2Axios } from "apis";

// 아이디 중복 체크
interface RequestDupCheck {
  id: string;
}

interface ResponseDupCheck {
  data: null;
}

const dupCheck = async function (data: RequestDupCheck) {
  const url = "/auth/user/dup_check";
  const response = await v2Axios.post<ResponseDupCheck>(url, data);
  return response.data.data;
};

const userAPI = {
  dupCheck,
};

export default userAPI;
