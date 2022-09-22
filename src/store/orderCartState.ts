import { atom } from 'recoil';
import { StoreOrderItemExcelParsing } from '@apis/orderAPI';

export interface OrderCartState {
  successList: StoreOrderItemExcelParsing[];
}

export const orderCartState = atom<OrderCartState>({
  key: 'orderCart',
  default: {
    successList: [],
  },
});
