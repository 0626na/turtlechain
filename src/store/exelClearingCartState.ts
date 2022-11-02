import { atom } from 'recoil';
import { ClearingItemParse } from '@apis/clearingAPI';
import moment from 'moment';

export interface exelClearingCartState {
  clearingRequestDate: string;
  successList: ClearingItemParse[];
  failList: ClearingItemParse[];
}

// 정산상품 생성을 위한 장바구품
export const exelClearingCartState = atom<exelClearingCartState>({
  key: 'exelClearingCart',
  default: {
    clearingRequestDate: moment().format('YYYY-MM-DD'),
    successList: [],
    failList: [],
  },
});
