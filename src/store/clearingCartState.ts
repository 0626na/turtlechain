import { atom } from "recoil";
import { RequestCreateItem } from "apis/clearingAPI";

export interface ClearingCartState extends RequestCreateItem {
  selectedKeys: number[];
}

// 정산상품 생성을 위한 장바구품
export const clearingCartState = atom<ClearingCartState>({
  key: "clearingCart",
  default: {
    selectedKeys: [],
    warehousing_item_list: [],
    subtract_item_list: [],
    reserve_item_list: [],
  },
});
