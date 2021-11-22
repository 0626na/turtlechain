import { useResetRecoilState } from "recoil";
import { tokenState } from "store/tokenState";
import { TOKEN } from "constant";

const useLogout = function () {
  const resetToken = useResetRecoilState(tokenState);
  const logout = () => {
    resetToken();
    localStorage.removeItem(TOKEN);
  };

  return { logout };
};

export default useLogout;
