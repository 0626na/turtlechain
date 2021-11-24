import { v2Axios } from "apis";

// 아이디 찾기
interface RequestGetID {
  phone: string;
  token: string;
}

interface ResponseGetID {
  data: Array<{ id: number; user_id: string }>;
}

const getID = async function (data: RequestGetID) {
  const { phone, token } = data;
  const url = `/provisioning/user?phone=${phone}`;
  const config = { headers: { Authorization: `Api-Key ${token}` } };
  const response = await v2Axios.get<ResponseGetID>(url, config);
  return response.data.data;
};

// 비밀번호 재설정
interface RequestResetPassword {
  login_id: string;
  password: string;
  phone: string;
  token: string;
}

interface ResponseResetPassword {
  data: null;
}

const resetPassword = async function (data: RequestResetPassword) {
  const { token } = data;
  const url = "/provisioning/user/password";
  const config = { headers: { Authorization: `Api-Key ${token}` } };
  const response = await v2Axios.put<ResponseResetPassword>(url, data, config);
  return response.data.data;
};

// 아이디 중복 체크
interface RequestDupCheck {
  login_id: string;
}

interface ResponseDupCheck {
  data: null;
}

const dupCheck = async function (data: RequestDupCheck) {
  const url = "/provisioning/user/dup_check";
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
  type: "rt" | "ws" | "st" | "pi";
}

interface ResponseCreate {
  data: null;
}

const create = async function (data: RequestCreate) {
  const url = "/provisioning/user";
  const response = await v2Axios.post<ResponseCreate>(url, data);
  return response.data.data;
};

const userAPI = {
  getID,
  resetPassword,
  dupCheck,
  create,
};

export default userAPI;
