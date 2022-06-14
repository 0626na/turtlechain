import { v2Axios } from '.';
import { VendorAccount, WholesaleShow } from './vendorAPI';
import { saveAs } from 'file-saver';
import moment from 'moment';

export interface Vendor {
  vendor_code: string;
  name: string;
  address: string;
  account: string;
  ws_store_info: Array<WholesaleShow>;
  match_type: string;

  memo: string;
  memo_active: boolean;
  memo_value: string;
  is_vat_included: boolean;
  use_vendor_name: string;
  use_vendor?: WholesaleShow;
  use_account?: VendorAccount;
  check_account?: boolean;
}

export interface OrderProduct {
  vendor_id: number;
  vendor_code: string;
  vendor_name: string;
  vendor_address: string;
  vendor_phone: string;
  vendor_product_name: string;

  product_id: number;
  product_code: string;
  product_name: string;
  product_price: string;

  count: number;
  order_price: number;
  option: string;
  image_url: string;
  memo: string;
  type: string;
}

export interface ParseCount {
  success_count: number;
  suggest_count: number;
  fail_count: number;
  duplicated_count: number;
}

/*
 *   거래처 파싱
 */

export interface ResponseParseVendor {
  msg: string;
  data: {
    success: Array<Vendor>;
    suggest: Array<Vendor>;
    fail: Array<Vendor>;
    count: ParseCount;
    error?: string;
  };
}

const parseVendor = async function (data: FormData) {
  const url = `excel/vendor`;
  const response = await v2Axios.post<ResponseParseVendor>(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/*
 *   주문 파싱
 */

export interface ResponseParseOrder {
  msg: string;
  data: {
    success: Array<OrderProduct>;
    fail: Array<OrderProduct>;
    error: string;
  };
}

const parseOrder = async function (data: FormData) {
  const url = `excel/order`;
  const response = await v2Axios.post<ResponseParseOrder>(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

interface RequestDownload {
  rt_store_id?: number;
  start_date: string;
  end_date: string;
}

// 정산내역 다운로드
const downloadClearing = async function (query: RequestDownload) {
  let url = `excel/download/clearing?`;
  for (const [key, value] of Object.entries(query)) {
    url = url + `${key}=${value}&`;
  }
  const response = await v2Axios.get(url, { responseType: 'arraybuffer' });
  // 파일 저장
  saveAs(
    new Blob([response.data], { type: 'application/ms-excel' }),
    `${moment(query.start_date).format('YYMMDD')}_${moment(
      query.end_date,
    ).format('YYMMDD')}_정산내역.xlsx`,
  );
};

const excelAPI = {
  parseVendor,
  parseOrder,
  downloadClearing,
};

export default excelAPI;
