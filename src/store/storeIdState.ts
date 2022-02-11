import { atom } from "recoil";

export type StoreId = number | null;

export const storeIdState = atom<StoreId>({
  key: "storeId",
  default: null,
});
