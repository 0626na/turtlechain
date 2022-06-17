import { RcFile } from 'antd/lib/upload';
import { atom } from 'recoil';
import { Product } from '@apis/productAPI';

export interface ProductCartState {
  fileList: RcFile[];
  successList: Product[];
  failList: Product[];
}

export const productCartState = atom<ProductCartState>({
  key: 'productCart',
  default: {
    fileList: [],
    successList: [],
    failList: [],
  },
});
