import { tokenState } from "store/tokenState";
import { v1Axios, v2Axios } from "apis";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import useLogout from "./useLogout";
import { message } from "antd";

const useLogin = function () {
  const { logout } = useLogout();
  const { t } = useTranslation();
  const setToken = useSetRecoilState(tokenState);
  const axiosList = [v1Axios, v2Axios];

  const login = (token: string) => {
    // 스토어에 토큰 저장
    setToken(token);

    // headers 토큰 설정 및 401 에러 처리
    axiosList.forEach((axios) => {
      axios.defaults.headers.common["Authorization"] = `JWT ${token}`;
      axios.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          const { status } = error.response;
          if (status === 401) {
            logout();
            message.info(t("message.expired token"));
          }
          return Promise.reject(error);
        }
      );
    });
  };

  return { login };
};

export default useLogin;
