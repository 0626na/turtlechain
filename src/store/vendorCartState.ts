import { atom } from 'recoil';
import {
  ParsedVendor,
  Wholesale,
  VendorAccount,
  ParesdResult,
} from '@apis/vendorAPI';

export interface SuccessItem extends ParsedVendor {
  isVatIncluded: boolean;
  useVendorName: string;
  memo?: string;
}

export interface PendingItem extends SuccessItem {
  isMatching: boolean;
  selectedWsStoreInfo?: SelectedWholesale;
}

interface FailItem extends ParsedVendor {
  memo?: string;
}

export interface SelectedWholesale extends Wholesale {
  selectedAccount?: VendorAccount;
}

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
