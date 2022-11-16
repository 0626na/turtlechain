import { t } from 'i18next';
import { TOKEN } from '@constant/index';
import { useCallback, useMemo, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { v2Axios } from '@apis/index';
import { message } from '@utils/message';
import { useUser } from '.';
import authAPI from '@apis/authAPI';

const useLogin = function () {
  const navigate = useNavigate();
  const { loadUser, resetUser } = useUser();
  const [errorMsg, setErrorMsg] = useState('');

  const logout = useCallback(() => {
    resetUser();
    removeStorage();
    clearToken();
    navigate('/');
  }, []);

  const login = useCallback((token: string) => {
    sessionStorage.setItem(TOKEN, token);
    applyToken(token);
    loadUser();
  }, []);

  const autoLogin = useCallback((token: string) => {
    localStorage.setItem(TOKEN, token);
    applyToken(token);
    loadUser();
  }, []);

  const clearToken = useCallback(() => {
    v2Axios.defaults.headers.common['Authorization'] = '';
  }, []);

  const removeStorage = useCallback(() => {
    sessionStorage.removeItem(TOKEN);
    localStorage.removeItem(TOKEN);
  }, []);

  const loginRequest = useCallback(
    async (login_id: string, password: string, isAutoLogin: boolean) => {
      if (!login_id) {
        setErrorMsg(t('message.enterId'));
        return;
      }
      if (!password) {
        setErrorMsg(t('message.enterPassword'));
        return;
      }

      try {
        const { token, user_info } = await authAPI.login({
          login_id,
          password,
        });

        const isPicker = user_info.type === 'pi';

        isAutoLogin ? autoLogin(token) : login(token);
        routeHome(isPicker);
      } catch (e) {
        handleErrorMsg(e as AxiosError);
      }
    },
    [],
  );

  const routeHome = useCallback((isPicker: boolean) => {
    if (isPicker) {
      navigate('/picker/vendor');
      return;
    }

    navigate('/home');
  }, []);

  const handleErrorMsg = useCallback((error: AxiosError) => {
    console.log(error.response?.status);
    if (error.response?.status === 400) {
      setErrorMsg(`${t('message.incorrectUser')}`);
      return;
    }

    if (error.response) {
      setErrorMsg(`${t('message.networkError')}`);
      return;
    }
  }, []);

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
          const msg = error.response.data.msg;
          msg && message.error(msg);
        } else {
          message.error(`${t('message.networkError')}`);
        }
        return Promise.reject(error);
      },
    );
  }, []);

  const applyToken = useCallback((token: string) => {
    v2Axios.defaults.headers.common['Authorization'] = `JWT ${token}`;
    applyInterceptor();
  }, []);

  const isLogin = useMemo(() => {
    // 최초 접속시 Storage에 TOKEN 있으면 자동 로그인해준다.
    const localToken = localStorage.getItem(TOKEN);
    localToken && autoLogin(localToken);
    const sessionToken = sessionStorage.getItem(TOKEN);
    sessionToken && login(sessionToken);

    return localToken || sessionToken;
  }, []);

  return {
    logout,
    isLogin,
    loginRequest,
    errorMsg,
  };
};

export default useLogin;
