import { RcFile } from "antd/lib/upload";
import { WarehousingItem } from "apis/warehousingAPI";
import { atom } from "recoil";

export interface WarehousingCartState {
  fileList: RcFile[];
  successList: WarehousingItem[];
  failList: WarehousingItem[];
}

// 입고상품 생성을 위한 장바구니
export const warehousingCartState = atom<WarehousingCartState>({
  key: "wearhousingCart",
  default: {
    fileList: [],
    successList: [],
    failList: [],
  },
});
