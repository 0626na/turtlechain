import { UserInfo } from '@apis/authAPI';
import { atom } from 'recoil';

export const userState = atom<UserInfo>({
  key: 'user',
  default: {
    id: undefined,
    login_id: '',
    name: '',
    email: '',
    mobile_phone: '',
    company_id: undefined,
    type: 'rt',
  },
});
