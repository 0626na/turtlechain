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

// 유저 생성
interface RequestCreate {
  mobile_tel: string;
  name: string;
  email: string;
  login_id: string;
  password: string;
  company_id: number;
}

interface ResponseCreate {
  data: null;
}

const create = async function (data: RequestCreate) {
  const url = "/auth/user";
  const response = await v2Axios.post<ResponseCreate>(url, data);
  return response.data.data;
};

const userAPI = {
  dupCheck,
  create,
};

export default userAPI;
