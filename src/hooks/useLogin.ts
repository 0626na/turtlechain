import { t } from 'i18next';
import { TOKEN } from '@constant/index';
import { useCallback, useMemo, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { v2Axios } from '@apis/index';
import { message } from '@utils/message';
import { useUser } from '.';
import authAPI, { RequestLogin } from '@apis/authAPI';
import { useMutation } from 'react-query';

const useLogin = function () {
  const navigate = useNavigate();
  const { loadUser } = useUser();
  const [errorMsg, setErrorMsg] = useState('');

  const clearToken = useCallback(() => {
    v2Axios.defaults.headers.common['Authorization'] = '';
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN);
    localStorage.removeItem(TOKEN);
    clearToken();
    navigate('/');
  }, [clearToken, navigate]);

  const loginTemp = useCallback(
    (login_id: string, password: string, autoLogin: boolean) => {
      if (!login_id) {
        setErrorMsg(t('message.enterId'));
        return;
      }
      if (!password) {
        setErrorMsg(t('message.enterPassword'));
        return;
      }

      if (autoLogin) {
        autoLoginMutation.mutate({ login_id, password });
      }

      loginMutation.mutate({ login_id, password });
    },
    [],
  );

  // 로그인 요청
  const loginMutation = useMutation(authAPI.login, {
    onError: (data: AxiosError) => {
      if (data.response?.status === 400) {
        setErrorMsg(`${t('message.incorrectUser')}`);
        return;
      }

      if (data.response) {
        setErrorMsg(`${t('message.networkError')}`);
        return;
      }
    },
    onSuccess: ({ token, user_info }) => {
      login(token);
      if (user_info.type === 'pi') {
        navigate('/picker/vendor');
        return;
      }
      navigate('/home');
    },
  });

  const autoLoginMutation = useMutation(authAPI.login, {
    onError: (data: AxiosError) => {
      if (data.response?.status === 400) {
        setErrorMsg(`${t('message.incorrectUser')}`);
        return;
      }

      if (data.response) {
        setErrorMsg(`${t('message.networkError')}`);
        return;
      }
    },
    onSuccess: ({ token, user_info }) => {
      autoLogin(token);
      if (user_info.type === 'pi') {
        navigate('/picker/vendor');
        return;
      }
      navigate('/home');
    },
  });

  const applyInterceptor = useCallback(() => {
    v2Axios.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          logout();
          message.warn(`${t('message.loginExpired')}`);
        } else if (error.response?.status === 400) {
          message.error(error.response.data.msg);
        } else {
          //TODO: i18n 개편끝나고 리팩토링 필요
          message.error(
            `알 수 없는 오류가 발생했습니다. 채널톡으로 문의 해주세요.`,
          );
        }
        return Promise.reject(error);
      },
    );
  }, [logout]);

  const applyToken = useCallback(
    (token: string) => {
      v2Axios.defaults.headers.common['Authorization'] = `JWT ${token}`;
      applyInterceptor();
    },
    [applyInterceptor],
  );

  const login = useCallback(
    (token: string) => {
      sessionStorage.setItem(TOKEN, token);
      applyToken(token);
      loadUser();
    },
    [applyToken],
  );

  const autoLogin = useCallback(
    (token: string) => {
      localStorage.setItem(TOKEN, token);
      applyToken(token);
      loadUser();
    },
    [applyToken],
  );

  const isLogin = useMemo(() => {
    // 최초 접속시 Storage에 TOKEN 있으면 자동 로그인해준다.
    const localToken = localStorage.getItem(TOKEN);
    localToken && autoLogin(localToken);
    const sessionToken = sessionStorage.getItem(TOKEN);
    sessionToken && login(sessionToken);

    return localToken || sessionToken;
  }, [login, autoLogin]);

  return {
    logout,
    isLogin,
    loginTemp,
    errorMsg,
  };
};

export default useLogin;
