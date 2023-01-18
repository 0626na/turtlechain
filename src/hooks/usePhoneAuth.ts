import authAPI from '@apis/authAPI';
import { VERIFY_TC_USER } from '@constant/index';
import { message } from '@utils/message';

import { AxiosError } from 'axios';
import { t } from 'i18next';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

const SUCCESS = 'success';

type Auth = '인증하기' | '재발송' | '인증완료';

// 남은 시간 계산
const calculateExpireTime = (time: Date) => {
  return moment.duration(moment(time).diff(moment())).asSeconds() * 1000;
};

const usePhoneAuth = () => {
  const [session_key, setSessionKey] = useState('');
  const [expire_time, setExpireTime] = useState<null | number>(null);
  const [authStatus, setAuthStatus] = useState<Auth>(t('description.do'));

  // 유저가 등록되어있는 유저인지 확인
  const verifyUserMutation = useMutation(authAPI.verifyUser, {
    onError: (error: AxiosError) => {
      if (
        error.response?.status === 400 &&
        error.response.data.msg === 'failed'
      ) {
        message.error('등록되지 않은 휴대전화 번호 입니다.');

        return;
      }

      if (
        error.response?.status === 400 &&
        error.response.data.mobile === 'Invalid Value'
      ) {
        message.error('휴대전화 번호 양식을 확인해주세요.');

        return;
      }
    },
  });

  const createOTPmutation = useMutation(authAPI.createPhoneOTP, {
    onSuccess: ({ session_key, expire_time }) => {
      message.success(t('message.success create auth num'));
      setAuthStatus(t('description.retry'));
      setSessionKey(session_key);
      setExpireTime(calculateExpireTime(expire_time));
    },
    onError: (error: AxiosError) => {
      message.error(error.response?.data.msg);
    },
  });

  const verifyOTPmutation = useMutation(authAPI.verifyPhoneOTP, {
    onError: (error: AxiosError) => {
      message.warn(error.response?.data.msg);
    },
  });

  // 회원가입에서 인증코드 생성
  const createPhoneOTPofRegistration = (phone: string) => {
    createOTPmutation.mutate({ phone });
  };

  // 아이디,비밀번호 찾기에서 인증코드 생성
  const createPhoneOTPofFind = async (phone: string) => {
    const response = await verifyUserMutation.mutateAsync({
      action: VERIFY_TC_USER,
      mobile: phone,
    });

    if (response.msg === SUCCESS) {
      createOTPmutation.mutate({ phone });
    }
  };

  // 인증코드 확인
  const verifyOTPcode = async (otp_code: string) => {
    const response = await verifyOTPmutation.mutateAsync({
      session_key,
      otp_code,
    });

    if (response.msg === SUCCESS) {
      message.success(t('message.success verify auth num'));
      setAuthStatus(t('description.success'));
      setSessionKey('');
      setExpireTime(null);

      const token = response.data;

      return token;
    }
  };

  // 인증 남은 시간 카운트다운
  useEffect(() => {
    if (expire_time !== null) {
      const countdown = setTimeout(() => {
        if (expire_time > 0) {
          setExpireTime(expire_time - 1000);
          return;
        }

        setExpireTime(null);
        clearTimeout(countdown);
        message.warn(t('message.expired auth time'));
      }, 1000);

      return () => {
        clearTimeout(countdown);
      };
    }
  }, [expire_time]);

  const createOTPloading = createOTPmutation.isLoading;
  const verifyOTPloading = verifyOTPmutation.isLoading;

  return {
    expire_time,
    authStatus,
    verifyOTPcode,
    createPhoneOTPofFind,
    createOTPloading,
    verifyOTPloading,
    createPhoneOTPofRegistration,
  };
};

export default usePhoneAuth;
