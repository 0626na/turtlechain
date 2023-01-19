import { PICKER, RETAILER, STAFF, VERIFY_TC_USER } from './../constant/index';
import { v2Axios } from '.';

export interface UserInfo {
  id: number;
  login_id: string;
  name: string;
  email: string;
  mobile_phone: string;
  company_id?: number;
  type: typeof RETAILER | typeof PICKER | typeof STAFF | '';
}

/*
 *  로그인
 */

export interface RequestLogin {
  login_id: string;
  password: string;
}

export interface ResponseLogin {
  token: string;
  user_info: UserInfo;
}

const login = async (data: RequestLogin) => {
  const url = 'auth/login';
  const response = await v2Axios.post<ResponseLogin>(url, data);

  return response.data;
};

/*
 *  유저 유효여부
 */

export interface ResponseVerify {
  token: string;
  user_info: UserInfo;
}

const verifyLoginToken = async () => {
  const url = `auth/login/verify`;
  const response = await v2Axios.post<ResponseVerify>(url, {
    token: v2Axios.defaults.headers.common['Authorization'].substring(4),
  });

  return response.data;
};

/*
 * 유저 일치여부 확인
 */

// type VERIFY_TC_USER = "verify_tc_user"

interface RequestVerifyUser {
  action: typeof VERIFY_TC_USER;
  mobile: string;
}

interface ResponseVerifyUser {
  msg: string;
  data: null;
}

const verifyUser = async (data: RequestVerifyUser) => {
  const url = '/provisioning/verification';
  const response = await v2Axios.post<ResponseVerifyUser>(url, data);

  return response.data;
};

/*
 * OTP 생성
 */

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
  const url = '/auth/phone_otp';
  const response = await v2Axios.post<ResponseCreatePhoneOTP>(url, data);
  return response.data.data;
};

/*
 * OTP 확인
 */

interface RequestVerifyPhoneOTP {
  session_key: string;
  otp_code: string;
}

interface ResponseVerifyPhoneOTP {
  msg: string;
  data: string;
}

const verifyPhoneOTP = async function (data: RequestVerifyPhoneOTP) {
  const url = '/auth/phone_otp/verify';
  const response = await v2Axios.post<ResponseVerifyPhoneOTP>(url, data);
  return response.data;
};

const authAPI = {
  verifyUser,
  login,
  verifyLoginToken,
  createPhoneOTP,
  verifyPhoneOTP,
};

export default authAPI;
