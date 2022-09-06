import { atom } from 'recoil';
import { ClearingInfo } from '@apis/clearingAPI';

export interface ClearingCartTempState {
  subtractList: ClearingInfo[];
  additionalList: ClearingInfo[];
  resultList: ClearingInfo[];
}

// 정산상품 생성을 위한 장바구품
export const clearingCartTempState = atom<ClearingCartTempState>({
  key: 'clearingCartTemp',
  default: {
    subtractList: [],
    additionalList: [],
    resultList: [],
  },
});
