import { atom } from 'recoil';

// any: building response data 계속 바뀜
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const building = atom<any>({
  key: 'building',
  default: null,
});

// any: bank response data 계속 바뀜
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const bank = atom<any>({
  key: 'bank',
  default: null,
});

export default {
  building,
  bank,
};
