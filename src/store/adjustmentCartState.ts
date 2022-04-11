import { AdjustmentItem } from "./../apis/adjustmentAPI";
import { atom } from "recoil";

export interface AdjustmentCartState {
  successList: AdjustmentItem[];
}

// 매입조정 상품 생성을 위한 장바구니
export const adjustmentCartState = atom<AdjustmentCartState>({
  key: "adjustmentCart",
  default: {
    successList: [],
  },
});
