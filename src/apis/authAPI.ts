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
  const url = "/authentication/phone_otp";
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
  const url = "/authentication/phone_otp/verify";
  const response = await customAxios.post<ResponseVerifyPhoneOTP>(url, data);
  return response.data.data;
};

const authAPI = {
  createPhoneOTP,
  verifyPhoneOTP,
};

export default authAPI;
