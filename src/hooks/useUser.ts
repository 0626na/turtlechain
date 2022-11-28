import { UserInfo } from './../apis/authAPI';
import { useCallback } from 'react';
import { userState } from './../store/userState';
import { useRecoilState } from 'recoil';
import authAPI from '@apis/authAPI';
import TagManager from 'react-gtm-module';

const setGtmUser = (userInfo: UserInfo) => {
  TagManager.dataLayer({
    dataLayer: {
      userId: userInfo.id,
    },
  });
};

function useUser() {
  const [user, setUser] = useRecoilState(userState);

  const reloadUser = useCallback(async () => {
    const { user_info } = await authAPI.verify();
    setUser(user_info);
    setGtmUser(user_info);
  }, []);

  const loadUser = useCallback(() => {
    // 이미 user가 존재한다면 재요청 하지 않는다.
    if (user) return;

    reloadUser();
  }, [user]);

  const resetUser = useCallback(() => {
    setUser(null);
  }, []);

  return {
    user,
    loadUser,
    resetUser,
  };
}

export default useUser;
