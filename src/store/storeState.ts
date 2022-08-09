import { atom } from 'recoil';

export interface Store {
  id: number | undefined;
  name: string;
  inventory_is_vat_included: boolean;
  version: '2.0' | 'agency_services';
}

export const storeState = atom<Store>({
  key: 'store',
  default: {
    id: undefined,
    name: '',
    inventory_is_vat_included: false,
    version: '2.0',
  },
});
