import { atom } from "recoil";

export type TokenState = string | null;

export const tokenState = atom<TokenState>({
  key: "tokenState",
  default: null,
});
