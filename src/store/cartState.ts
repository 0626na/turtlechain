import { atom } from "recoil";
import { RequestCreateItem } from "apis/clearingAPI";

export interface CartState extends RequestCreateItem {
  selectedKeys: number[];
}

// 정산상품 생성을 위한 장바구품
export const cartState = atom<CartState>({
  key: "clearingCart",
  default: {
    selectedKeys: [],
    warehousing_item_list: [],
    adjustment_item_list: [],
  },
});
