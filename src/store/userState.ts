import { UserInfo } from '@apis/authAPI';
import { atom } from 'recoil';

export const userState = atom<UserInfo | null>({
  key: 'user',
  default: null,
});
