import { atom } from 'recoil';

// any: building response data 계속 바뀜
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildingData = atom<any>({
  key: 'buildingData',
  default: null,
});

// any: bank response data 계속 바뀜
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const bankData = atom<any>({
  key: 'bankData',
  default: null,
});

export default {
  buildingData,
  bankData,
};
