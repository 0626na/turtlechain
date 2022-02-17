import { atom } from "recoil";

export interface Store {
  id: number | undefined;
  name: string;
}

export const storeState = atom<Store>({
  key: "store",
  default: {
    id: undefined,
    name: "",
  },
});
