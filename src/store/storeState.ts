import { StoreShow } from '@apis/retailerStoreAPI';
import { atom } from 'recoil';

export interface StoreState {
  list: StoreShow[];
  selected?: StoreShow;
}
export const storeState = atom<StoreState>({
  key: 'store',
  default: {
    list: [],
    selected: undefined,
  },
});
