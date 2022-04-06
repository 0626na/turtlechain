import { atom } from "recoil";
import { RequestCreateItem } from "apis/clearingAPI";

export const cartState = atom<RequestCreateItem>({
  key: "clearingCart",
  default: {
    warehousing_item_list: [],
    adjustment_item_list: [],
  },
});
