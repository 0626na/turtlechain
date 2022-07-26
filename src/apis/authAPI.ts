import { v2Axios } from '.';

/*
 *  로그인
 */
export interface RequestLogin {
  login_id: string;
  password: string;
}

export interface ResponseLogin {
  token: string;
}

const login = async function (data: RequestLogin) {
  const url = 'auth/login';
  const response = await v2Axios.post<ResponseLogin>(url, data);
  return response.data;
};

/*
 *  유저 유효여부
 */

export interface ResponseVerify {
  token: string;
  user_info: {
    id: number;
    login_id: string;
    name: string;
    email: string;
    mobile_phone: string;
    company_id: number;
  };
}

const verify = async () => {
  const url = `auth/login/verify`;
  const response = await v2Axios.post<ResponseVerify>(url, {
    token: v2Axios.defaults.headers.common['Authorization'].substring(4),
  });
  return response.data.user_info;
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
  data: string;
}

const verifyPhoneOTP = async function (data: RequestVerifyPhoneOTP) {
  const url = '/auth/phone_otp/verify';
  const response = await v2Axios.post<ResponseVerifyPhoneOTP>(url, data);
  return response.data.data;
};

const authAPI = {
  login,
  verify,
  createPhoneOTP,
  verifyPhoneOTP,
};

export default authAPI;
