import { RcFile } from "antd/lib/upload";
import { Product } from "apis/productAPI";
import { atom } from "recoil";

export interface ProductCartState {
  fileList: RcFile[];
  successList: Product[];
  failList: Product[];
}

export const productCartState = atom<ProductCartState>({
  key: "productCart",
  default: {
    fileList: [],
    successList: [],
    failList: [],
  },
});
