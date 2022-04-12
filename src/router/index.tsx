import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import useLogin from "hooks/useLogin";
import { TOKEN } from "constant";
import LoginRouter from "./LoginRouter";
import MainRouter from "./MainRouter";
import { useRecoilValue } from "recoil";
import { tokenState } from "store/tokenState";

function Router() {
  const login = useLogin();
  const token = useRecoilValue(tokenState);
  const localStorageToken = localStorage.getItem(TOKEN);
  const sessionStorageToken = sessionStorage.getItem(TOKEN);

  useEffect(() => {
    if (localStorageToken) {
      login(localStorageToken);
    }
    if (sessionStorageToken) {
      login(sessionStorageToken);
    }
  });

  useEffect(() => {}, [token]);

  return (
    <BrowserRouter>
      {localStorageToken || sessionStorageToken ? ( //
        <MainRouter />
      ) : (
        <LoginRouter />
      )}
    </BrowserRouter>
  );
}

export default Router;
