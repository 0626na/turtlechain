import userAPI from '@apis/userAPI';
import { message } from '@utils/message';
import { t } from 'i18next';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

const useResetPassword = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');

  // 아이디 리스트 요청
  const { data = [] } = useQuery(
    ['getID', phone, token],
    () => userAPI.getID({ phone, token }),
    {
      enabled: !!phone && !!token,
    },
  );

  // 비밀번호 재설정 요청
  const resetPasswordMutation = useMutation(userAPI.resetPassword, {
    onSuccess: () => {
      message.success(t('message.success reset password'));
      navigate('/');
    },
  });

  const userList = data?.map((user) => ({
    value: user.login_id,
    name: user.login_id,
  }));

  return { userList };
};

export default useResetPassword;
