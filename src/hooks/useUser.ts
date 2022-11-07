import { useCallback } from 'react';
import { userState } from './../store/userState';
import { useRecoilState } from 'recoil';
import authAPI from '@apis/authAPI';

function useUser() {
  const [user, setUser] = useRecoilState(userState);

  const loadUser = useCallback(async () => {
    const { user_info } = await authAPI.verify();
    setUser(user_info);
  }, []);

  return {
    user,
    setUser,
    loadUser,
  };
}

export default useUser;
