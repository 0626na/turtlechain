import { RcFile } from 'antd/lib/upload';
import { v2Axios } from '.';

/*
 * 아이디 중복 체크
 */

interface RequestDupCheck {
  login_id: string;
  encrypted_text?: string;
}

interface ResponseDupCheck {
  msg: string;
  data: null;
}

const dupCheck = async function (params: RequestDupCheck) {
  const url = '/provisioning/registration/duplication-check';
  const response = await v2Axios.get<ResponseDupCheck>(url, { params });
  return response.data;
};

/*
 *  회원가입
 */

export interface RequestCreate {
  user_name: string;
  user_email: string;
  user_mobile: string;
  user_login_id: string;
  user_password: string;
  user_type: 'rt';

  company_biz_type: 'entity' | 'personal' | 'simple';
  company_owner: string;
  company_name: string;
  company_biz_num: string;
  company_main_address: string;
  company_sub_address: string;
  company_store_url: string;
  company_biz_license_file: RcFile;
}

interface ResponseCreate {
  msg: string;
}

const create = async function (data: RequestCreate) {
  const url = '/provisioning/registration';
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  const response = await v2Axios.post<ResponseCreate>(url, formData);
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
    // 사업자 정보
    company_biz_type: 'entity' | 'personal' | 'simple';
    company_owner: string;
    company_name: string;
    company_biz_num: string;
    company_main_address: string;
    company_sub_address: string;
    company_biz_license_file: RcFile;
    company_store_url: string;

    // 관리자 계정
    user_name: string;
    user_email: string;
    user_mobile: string;
    user_login_id: string;
    user_password: string;
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

const update = async function (data: RequestUpdate) {
  const url = `/provisioning/user/${data.user_id}`;
  delete data.user_id;
  const response = await v2Axios.patch(url, data);
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
  data: Array<{ id: number; user_id: string }>;
}

const getID = async function (data: RequestGetID) {
  const { phone, token } = data;
  const url = `/provisioning/user?phone=${phone}`;
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
  const url = '/provisioning/user/password';
  const config = { headers: { Authorization: `Api-Key ${token}` } };
  const response = await v2Axios.put<ResponseResetPassword>(url, data, config);
  return response.data.data;
};

const userAPI = {
  dupCheck,
  create,
  update,
  getID,
  resetPassword,
  getRegistration,
  updateRegistration,
};

export default userAPI;
