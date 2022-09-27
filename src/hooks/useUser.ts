import { userState } from './../store/userState';
import { useRecoilState } from 'recoil';
import React from 'react';

function useUser() {
  const [user, setUser] = useRecoilState(userState);

  return {
    user,
    setUser,
  };
}

export default useUser;
