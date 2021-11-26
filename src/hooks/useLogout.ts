import { useResetRecoilState } from "recoil";
import { tokenState } from "store/tokenState";
import { TOKEN } from "constant";
import { v1Axios, v2Axios } from "apis";
import { useQueryClient } from "react-query";

const useLogout = function () {
  const queryClient = useQueryClient();
  const resetToken = useResetRecoilState(tokenState);
  const logout = () => {
    v1Axios.defaults.headers.common["Authorization"] = "";
    v2Axios.defaults.headers.common["Authorization"] = "";
    queryClient.refetchQueries();
    localStorage.removeItem(TOKEN);
    resetToken();
  };

  return { logout };
};

export default useLogout;
