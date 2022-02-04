
// 입고아이템 타입
export interface AdjustmentSheetItem {
  id: number;
  sheet_id: number;
  rt_store_id: number;
  mall_name: string;
  store_id: number;
  store_code: number;
  store_name: string;
  address: string;
  product_id: number;
  product_code: string;
  product_name: string;
  option: string;
  count: number;
  price: number;
  memo: string;
  created_by: number;
  created_time: Date;
  is_deleted: boolean;
  is_vat_included: boolean;
}