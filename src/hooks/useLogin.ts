import { useSetRecoilState } from "recoil";
import { tokenState } from "store/tokenState";
import { v1Axios, v2Axios } from "apis";

const useLogin = function () {
  const setToken = useSetRecoilState(tokenState);
  const login = (token: string) => {
    v1Axios.defaults.headers.common["Authorization"] = `JWT ${token}`;
    v2Axios.defaults.headers.common["Authorization"] = `JWT ${token}`;
    setToken(token);
  };

  return { login };
};

export default useLogin;
