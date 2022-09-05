import { ParsedVendor } from '@apis/vendorAPI';
import { atom } from 'recoil';

export interface ParsedVendorListsState {
  successList: ParsedVendor[];
  suggestList: ParsedVendor[];
  failList: ParsedVendor[];
}

export const parsedVendorListsState = atom<ParsedVendorListsState>({
  key: 'parsedVendorListsState',
  default: {
    successList: [],
    suggestList: [],
    failList: [],
  },
});

export interface ParsedVendorCountsState {
  success_count: number;
  suggest_count: number;
  fail_count: number;
  duplicated_count: number;
}

export const parsedVendorCountsState = atom<ParsedVendorCountsState>({
  key: 'parsedVendorCountsState',
  default: {
    success_count: 0,
    suggest_count: 0,
    fail_count: 0,
    duplicated_count: 0,
  },
});
