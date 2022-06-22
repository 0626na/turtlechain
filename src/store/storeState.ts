import { atom } from 'recoil';

export interface Store {
  id: number | undefined;
  name: string;
  inventory_is_vat_included: boolean;
}

export const storeState = atom<Store>({
  key: 'store',
  default: {
    id: undefined,
    name: '',
    inventory_is_vat_included: false,
  },
});
