import { v2Axios } from "apis";

export interface RequestGetClearingStatus {
  start_date: string;
  end_date: string;
}

export interface ResponseGetClearingStatus {
  msg: string;
  data: Array<{
    request_date: string;
    complete_date: string;
    rt_store_name: string;
    vendor_total_count: string;
    total_price: number;
    vat_price: number;
    status: string;
  }>;
}

const getClearingStatus = async function (query: RequestGetClearingStatus) {
  let url = `main/clearing-status?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get<ResponseGetClearingStatus>(url);
  return response.data;
};

export interface ResponseGetUnprocessedStatus {
  msg: string;
  data: {
    refunds: {
      counts: number;
      total_price: number;
    };
    adjustments: {
      counts: number;
      total_price: number;
    };
  };
}

const getUnprocessedStatus = async function () {
  let url = `main/unprocessed-status`;
  const response = await v2Axios.get<ResponseGetUnprocessedStatus>(url);
  return response.data;
};

export interface RequestGetClearingStatistic {
  start_date: string;
  end_date: string;
}

export interface ResponseGetClearingStatistic {}

const getClearingStatistic = async function () {
  let url = `main/clearing`;
  const response = await v2Axios.get<ResponseGetClearingStatistic>(url);
  return response.data;
};

export interface RequestGetOrderStatistic {
  start_date: string;
  end_date: string;
}

export interface ResponseGetOrderStatistic {}

const getOrderStatistic = async function () {};

const mainAPI = {
  getClearingStatus,
  getUnprocessedStatus,
  getClearingStatistic,
  getOrderStatistic,
};

export default mainAPI;
