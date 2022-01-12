// 거래처 계좌 타입
export interface VendorAccount {
  id: number;
  account_number: string;
  account_holder: string;
  bank: string;
  is_proxy: boolean;
  is_deleted: boolean;
}

// 거래처 휴대번호 타입
export interface VendorPhone {
  id: number;
  is_deleted: boolean;
  phone: string;
  send_alimtalk: boolean;
  tag: string;
}

// 거래처 타입
export interface Vendor {
  id: number;
  vendor_id: string;
  ws_store_id: number;
  is_taxed: boolean;
  memo: string;
  ws_store_info: {
    store_account: Array<VendorAccount>;
    store_phone: Array<VendorPhone>;
    name: string;
    phone: string;
    building: string;
    floor: string;
    col: string;
    loc: string;
    ext: string;
  };
}

// Response: 거래처 리스트 가져오기 타입
export interface ResponseGetVendors {
  msg: string;
  data: Array<Vendor>;
}
