import { t } from 'i18next';
import { message } from 'antd';
import { useSetRecoilState } from 'recoil';
import { TOKEN } from '@constant/index';
import { tokenState } from '@store/tokenState';
import { v1Axios, v2Axios } from '@apis/index';
import useLogout from './useLogout';

const useLogin = function () {
  const logout = useLogout();
  const setToken = useSetRecoilState(tokenState);
  const axiosList = [v1Axios, v2Axios];

  const login = (token: string) => {
    // 스토어에 토큰 저장
    setToken(token);

    // sessionStorage에 토큰 저장
    sessionStorage.setItem(TOKEN, token);

    // headers 토큰 설정 및 401 에러 처리
    axiosList.forEach((axios) => {
      axios.defaults.headers.common['Authorization'] = `JWT ${token}`;
      axios.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          const { status } = error.response;
          if (status === 401) {
            logout();
            message.info(t('message.expired token'));
          } else {
            message.error(error.response?.data.msg);
          }
          return Promise.reject(error);
        },
      );
    });
  };

  return login;
};

export default useLogin;
