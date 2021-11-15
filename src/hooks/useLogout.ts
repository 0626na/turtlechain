import { useResetRecoilState } from "recoil";
import { tokenState } from "store/tokenState";
import { TOKEN_NAME } from "constant/string";

const useLogout = function () {
  const resetToken = useResetRecoilState(tokenState);
  const logout = () => {
    resetToken();
    localStorage.removeItem(TOKEN_NAME);
  };

  return { logout };
};

export default useLogout;
