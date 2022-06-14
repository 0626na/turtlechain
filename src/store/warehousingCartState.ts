import { RcFile } from 'antd/lib/upload';
import { atom } from 'recoil';
import { WarehousingItemConnect } from '@apis/warehousingAPI';

export interface WarehousingCartState {
  fileList: RcFile[];
  successList: WarehousingItemConnect[];
  failList: WarehousingItemConnect[];
  searchQuery: {
    type: string;
    search_string: string;
  };
}

// 입고상품 생성을 위한 장바구니
export const warehousingCartState = atom<WarehousingCartState>({
  key: 'wearhousingCart',
  default: {
    fileList: [],
    successList: [],
    failList: [],
    searchQuery: {
      type: 'all',
      search_string: '',
    },
  },
});
