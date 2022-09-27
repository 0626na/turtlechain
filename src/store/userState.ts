import { atom } from 'recoil';

interface UserState {
  type: 'rt' | 'pi';
  name: string;
}
export const userState = atom<UserState>({
  key: 'user',
  default: {
    type: 'rt',
    name: '',
  },
});
