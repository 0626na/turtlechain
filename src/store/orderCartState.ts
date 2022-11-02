import { ParsingStatus } from './../apis/orderAPI';
import { atom } from 'recoil';
import { StoreOrderItemExcelParsing } from '@apis/orderAPI';

export interface OrderCartState {
  successList: StoreOrderItemExcelParsing[];
  failList: StoreOrderItemExcelParsing[];
  parsingStatus: ParsingStatus;
}

export const orderCartState = atom<OrderCartState>({
  key: 'orderCart',
  default: {
    successList: [],
    failList: [],
    parsingStatus: { fail_count: 0, success_count: 0, error_messages: [] },
  },
});
