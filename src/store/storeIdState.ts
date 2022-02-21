import { atom } from "recoil";

export type StoreId = number | undefined;

export const storeIdState = atom<StoreId>({
  key: "storeId",
  default: undefined,
});

export const storeNameState= atom<StoreId>({
  key: "storeName",
  default: undefined,
});