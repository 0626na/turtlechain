import { v2Axios } from "apis";

interface RequestGetClearingStatus {
  start_date: string;
  end_date: string;
}

interface ResponseGetClearingStatus {
  msg: string;
  data: Array<{
    request_date: string;
    completed_date: string;
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
  const response = await v2Axios.get<Array<ResponseGetClearingStatus>>(url);
  return response.data;
};

interface ResponseGetUnprocessedStatus {
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

const mainAPI = {
  getClearingStatus,
  getUnprocessedStatus,
};

export default mainAPI;
