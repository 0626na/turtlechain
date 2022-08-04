import { atom } from 'recoil';
import { ClearingInfo } from '@apis/clearingAPI';
// import { AdjustmentItemShow } from '@apis/adjustmentAPI';

export interface ClearingCartState {
  warehousingBalanceList: ClearingInfo[];
  adjustmentSubtractList: ClearingInfo[];
  reserveSubtractList: ClearingInfo[];
  reservePaymentList: ClearingInfo[];
}

// 정산상품 생성을 위한 장바구품
export const clearingCartState = atom<ClearingCartState>({
  key: 'clearingCart',
  default: {
    warehousingBalanceList: [],
    adjustmentSubtractList: [], // 매입차감
    reserveSubtractList: [], // 미송 차감
    reservePaymentList: [], // 미송 입고
  },
});
