import { atom } from 'recoil';
import { Balance } from '@apis/clearingAPI';
import { AdjustmentItemShow } from '@apis/adjustmentAPI';

export interface ClearingCartState {
  warehousingBalanceList: Balance[];
  adjustmentBalanceList: Balance[];
  reserveSubtractList: Balance[];
  reserveBalanceList: AdjustmentItemShow[];
}

// 정산상품 생성을 위한 장바구품
export const clearingCartState = atom<ClearingCartState>({
  key: 'clearingCart',
  default: {
    warehousingBalanceList: [],
    adjustmentBalanceList: [],
    reserveSubtractList: [],
    reserveBalanceList: [],
  },
});
