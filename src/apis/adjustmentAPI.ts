// 입고아이템 타입
export interface AdjustmentSheetItem {
  id: number;
  created_by: number;
  created_time: Date;
  is_inactive: boolean;
  created_date: string;
  is_cleared: boolean;
  cleared_time: Date | null;
  rt_store_id: number;
  rt_store_name: string;
  ws_store_id: number;
  vendor_id: number;
  vendor_name: string;
  address: string;
  product_id: number;
  product_name: string;
  option: string;
  count: number;
  count_left: number;
  price: number;
  memo: string;
  is_vat_included: boolean;
  bank: string;
  account_number: string;
  account_holder: string;
  type: "reserve" | "takeback" | "exchange" | "refund";
}
