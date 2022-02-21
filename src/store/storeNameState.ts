import { atom } from "recoil";

export type StoreName = string | undefined;
export const storeNameState= atom<StoreName>({
  key: "storeName",
  default: undefined,
});