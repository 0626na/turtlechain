import { t } from 'i18next';
import { TOKEN } from '@constant/index';
import { useCallback, useMemo } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { v2Axios } from '@apis/index';
import { message } from '@utils/message';
import { useUser } from '.';

const useLogin = function () {
  const navigate = useNavigate();
  const { loadUser } = useUser();

  const clearToken = useCallback(() => {
    v2Axios.defaults.headers.common['Authorization'] = '';
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN);
    localStorage.removeItem(TOKEN);
    clearToken();
    navigate('/');
  }, [clearToken, navigate]);

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

  return { login, autoLogin, logout, isLogin };
};

export default useLogin;
