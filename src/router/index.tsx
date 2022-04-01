import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import useLogin from "hooks/useLogin";
import { TOKEN } from "constant";
import LoginRouter from "./LoginRouter";
import MainRouter from "./MainRouter";

function Router() {
  const login = useLogin();
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
