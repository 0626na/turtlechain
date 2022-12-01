import { RcFile } from 'antd/lib/upload';
import { v2Axios } from '.';

type UserType = 'rt' | 'pi' | 'ub';

/*
 * 아이디,사업자정보 중복 체크
 */

interface RequestDupCheck {
  login_id?: string;
  biz_num?: string;
  encrypted_text?: string;
}

interface ResponseDupCheck {
  msg: string;
  data: null;
}

const dupCheck = async (params: RequestDupCheck) => {
  const url = '/provisioning/registration/duplication-check';
  const response = await v2Axios.get<ResponseDupCheck>(url, { params });

  return response.data;
};

/*
 *  회원가입
 */

type AgreementsType = {
  service_use: boolean;
  personal_information: boolean;
  event_notificaton: boolean;
  third_party: boolean;
};

export interface RequestCreateRegistration {
  user_type: UserType;
  user_name: string;
  user_email: string;
  user_mobile: string;
  user_login_id: string;
  user_password: string;

  company_biz_type?: 'entity' | 'personal' | 'simple';
  company_owner?: string;
  company_name?: string;
  company_biz_num?: string;
  company_main_address?: string;
  company_sub_address?: string;
  company_store_url?: string;
  company_biz_license_file?: RcFile;

  agreements: AgreementsType;
}

interface ResponseCreateRegistration {
  msg: string;
}

const createRegistration = async (data: RequestCreateRegistration) => {
  const url = '/provisioning/registration';
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (key === 'agreements') {
      formData.append(key, JSON.stringify(value));
      continue;
    }

    formData.append(key, value);
  }

  const response = await v2Axios.post<ResponseCreateRegistration>(
    url,
    formData,
  );

  return response.data;
};

/*
 *  반려된 유저 정보 불러오기
 */

interface RequestGetRegistration {
  encrypted_text: string;
}

export interface ResponseGetRegistration {
  msg: string;
  data: {
    registration_list: [
      {
        id: number;
        // 사업자 정보
        company_biz_type: 'entity' | 'personal' | 'simple';
        company_owner: string;
        company_name: string;
        company_biz_num: string;
        company_main_address: string;
        company_sub_address: string;
        company_biz_license_path: string;
        company_store_url: string;

        // 관리자 계정
        user_name: string;
        user_email: string;
        user_mobile: string;
        user_login_id: string;
        user_password: string;
        user_type: UserType;
        agreements: AgreementsType;
      },
    ];
  };
}

const getRegistration = async (params: RequestGetRegistration) => {
  const url = `/provisioning/registration`;

  const response = await v2Axios.get<ResponseGetRegistration>(url, {
    params,
  });

  return response.data;
};

/*
 *  반려된 유저 정보 수정하기
 */

export interface RequestUpdateRegistration {
  id: number;
  data: {
    encrypted_text: string;
    // 관리자 계정
    user_type: UserType;
    user_name: string;
    user_email: string;
    user_mobile: string;
    user_login_id: string;
    user_password: string;
    // 사업자 정보
    company_biz_type?: 'entity' | 'personal' | 'simple';
    company_owner?: string;
    company_name?: string;
    company_biz_num?: string;
    company_main_address?: string;
    company_sub_address?: string;
    company_biz_license_file?: RcFile;
    company_store_url?: string;

    agreements: AgreementsType;
  };
}

interface ResponseUpdateRegistration {
  msg: string;
  data: {
    /// ...
  };
}

const updateRegistration = async (requestData: RequestUpdateRegistration) => {
  const url = `/provisioning/registration/${requestData.id}`;

  const formData = new FormData();
  for (const [key, value] of Object.entries(requestData.data)) {
    if (key === 'agreements') {
      formData.append(key, JSON.stringify(value));
      continue;
    }

    formData.append(key, value as string);
  }

  !requestData.data.company_biz_license_file &&
    formData.delete('company_biz_license_file');

  const response = await v2Axios.patch<ResponseUpdateRegistration>(
    url,
    formData,
  );

  return response.data;
};

/*
 *  유저 정보 수정
 */

interface RequestUpdate {
  user_id?: number;
  email: string;
  mobile_phone: string;
}

const update = async (data: RequestUpdate) => {
  const url = `/provisioning/users/${data.user_id}`;

  const response = await v2Axios.patch(url, {
    email: data.email,
    mobile_phone: data.mobile_phone,
  });

  return response.data;
};

/*
 *  아이디 찾기
 */

interface RequestGetID {
  phone: string;
  token: string;
}

interface ResponseGetID {
  data: Array<{ id: number; login_id: string }>;
}

const getID = async function (data: RequestGetID) {
  const { phone, token } = data;
  const url = `/provisioning/users?phone=${phone}`;
  const config = { headers: { Authorization: `Api-Key ${token}` } };
  const response = await v2Axios.get<ResponseGetID>(url, config);
  return response.data.data;
};

/*
 * 비밀번호 재설정
 */

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
  const url = '/provisioning/users/password';
  const config = { headers: { Authorization: `Api-Key ${token}` } };
  const response = await v2Axios.put<ResponseResetPassword>(url, data, config);
  return response.data.data;
};

/**
 * 유저의 구독 유무 확인
 */

export interface RequestGetSubscriptionCheck {
  company_id: number;
}

export interface ResponseGetSubscriptionCheck {
  msg: string;
  data: {
    is_subscribed: boolean;
    is_new: boolean;
    service_cost: number;
    subscription_info: SubscriptionInfo;
  };
}

export interface SubscriptionInfo {
  id: number;
  is_subscribed: boolean;
  company_id: number;
  pay_type: string;
  payer_id: string;
  pay_name: string;
  pay_number: string;
  start_date: string;
  end_date: string;
}

/**
 * 유저의 구독여부 확인
 */
const getSubscriptionCheck = async (params: RequestGetSubscriptionCheck) => {
  const url = `/subscriptions/${params.company_id}`;
  const response = await v2Axios.get<ResponseGetSubscriptionCheck>(url, {
    params,
  });

  return response.data;
};

const userAPI = {
  dupCheck,
  createRegistration,
  update,
  getID,
  resetPassword,
  getRegistration,
  updateRegistration,
  getSubscriptionCheck,
};

export default userAPI;
