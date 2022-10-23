import { atom } from 'recoil';
import { ClearingInfo } from '@apis/clearingAPI';
import moment from 'moment';
// import { AdjustmentItemShow } from '@apis/adjustmentAPI';

export interface ClearingCartState {
  clearingRequestDate: string;
  resultList: ClearingInfo[];
  adjustmentSubtractList: ClearingInfo[];
  reserveSubtractList: ClearingInfo[];
  reservePaymentList: ClearingInfo[];
}

// 정산상품 생성을 위한 장바구품
export const clearingCartState = atom<ClearingCartState>({
  key: 'clearingCart',
  default: {
    clearingRequestDate: moment().format('YYYY-MM-DD'),
    resultList: [],
    adjustmentSubtractList: [], // 매입차감
    reserveSubtractList: [], // 미송 차감
    reservePaymentList: [], // 미송 입고
  },
});
