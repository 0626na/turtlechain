import { useCallback } from 'react';
import { userState } from './../store/userState';
import { useRecoilState } from 'recoil';
import authAPI, { UserInfo } from '@apis/authAPI';
import TagManager from 'react-gtm-module';

const setGtmUser = (userId: number) => {
  TagManager.dataLayer({
    dataLayer: {
      userId,
    },
  });
};

function useUser() {
  const [user, setUser] = useRecoilState(userState);

  const reloadUser = useCallback(async () => {
    const { user_info } = await authAPI.verify();
    setUser(user_info);
    setGtmUser(user_info.id);
  }, []);

  const loadUser = useCallback(() => {
    // 이미 user가 존재한다면 재요청 하지 않는다.
    if (user) return;

    reloadUser();
  }, [user]);

  const resetUser = useCallback(() => {
    setUser(null);
  }, []);

  const isStaff = user?.type === 'st';

  return {
    user,
    loadUser,
    resetUser,
    isStaff,
  };
}

export default useUser;
