import { v2Axios } from '@apis/index';

interface RequestAuthenticate {
  company_id: number;
  request_type: 'PAY' | 'AUTH';
}

interface ResponseAuthenticate {
  msg: string;
  data: {
    PCD_PAY_TYPE: string;
    PCD_PAY_WORK: string;
    PCD_CARD_VER: string;
    PCD_PAY_GOODS: string;
    PCD_PAY_TOTAL: number;
    PCD_PAYER_NO: number;
    PCD_PAYER_NAME: string;
    PCD_PAYER_EMAIL: string;
    PCD_PAY_ISTAX: string;
    AuthKey: string;
    return_url: string;
  };
}

const authenticate = async (data: RequestAuthenticate) => {
  const url = `subscriptions/payple/authentication`;
  const response = await v2Axios.post<ResponseAuthenticate>(url, data);

  return response.data.data;
};

export interface RequestRemoveSubscription {
  compay_id: number;
  request_type: string;
  is_new?: boolean;
}

/**
 * 구독해지 API
 *
 */
const removeSubscription = async (data: RequestRemoveSubscription) => {
  const url = `subscriptions/${data.compay_id}`;
  const response = await v2Axios.patch(url, data);

  return response.data;
};

const paypleAPI = {
  authenticate,
  removeSubscription,
};

export default paypleAPI;
