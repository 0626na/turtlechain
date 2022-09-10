import {
  ParsedVendor,
  ParesdResult,
  Wholesale,
  VendorAccount,
} from '@apis/vendorAPI';

import { atom } from 'recoil';

export interface SuccessItem extends ParsedVendor {
  isVatIncluded: boolean;
  useVendorName: string;
  memo: string;
}

export interface SelectedWholesale extends Wholesale {
  selectedAccount?: VendorAccount;
}

export interface PendingItem extends ParsedVendor {
  isVatIncluded: boolean;
  useVendorName: string;
  memo: string;
  selectedWsStoreInfo?: SelectedWholesale;
}

interface FailItem extends ParsedVendor {}

export interface VendorCartState {
  successList: SuccessItem[];
  pendingList: PendingItem[];
  failList: FailItem[];
}
export const vendorCartState = atom<VendorCartState>({
  key: 'vendorCartState',
  default: {
    successList: [],
    pendingList: [],
    failList: [],
  },
});

export const vendorCartCountsState = atom<ParesdResult>({
  key: 'vendorCartCountsState',
  default: {
    success_count: 0,
    suggest_count: 0,
    fail_count: 0,
    duplicated_count: 0,
  },
});
