import { customAxios } from "apis";

// OTP 생성
interface RequestCreatePhoneOTP {
  phone: string;
}

interface ResponseCreatePhoneOTP {
  data: {
    session_key: string;
    expire_time: Date;
  };
}

const createPhoneOTP = async function (data: RequestCreatePhoneOTP) {
  const url = "/auth/phone_otp";
  const response = await customAxios.post<ResponseCreatePhoneOTP>(url, data);
  return response.data.data;
};

// OTP 확인
interface RequestVerifyPhoneOTP {
  session_key: string;
  otp_code: string;
}

interface ResponseVerifyPhoneOTP {
  data: string;
}

const verifyPhoneOTP = async function (data: RequestVerifyPhoneOTP) {
  const url = "/auth/phone_otp/verify";
  const response = await customAxios.post<ResponseVerifyPhoneOTP>(url, data);
  return response.data.data;
};

// 아이디 찾기
interface RequestGetUserID {
  phone: string;
  token: string;
}

interface ResponseGetUserID {
  data: Array<{ id: number; user_id: string }>;
}

const getUserID = async function (data: RequestGetUserID) {
  const { phone, token } = data;
  const url = `auth/user?phone=${phone}`;
  const config = { headers: { Authorization: `Api-Key ${token}` } };
  const response = await customAxios.get<ResponseGetUserID>(url, config);
  return response.data.data;
};

const authAPI = {
  createPhoneOTP,
  verifyPhoneOTP,
  getUserID,
};

export default authAPI;
