import { v1Axios, v2Axios } from "apis";

// 로그인
interface RequestLogin {
  login_id: string;
  password: string;
}

interface ResponseLogin {
  token: string;
}

const login = async function (data: RequestLogin) {
  const url = "/login";
  const response = await v1Axios.post<ResponseLogin>(url, data);
  return response.data;
};

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
  const response = await v2Axios.post<ResponseCreatePhoneOTP>(url, data);
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
  const response = await v2Axios.post<ResponseVerifyPhoneOTP>(url, data);
  return response.data.data;
};

const authAPI = {
  login,
  createPhoneOTP,
  verifyPhoneOTP,
};

export default authAPI;
