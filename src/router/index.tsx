import { useRecoilValue } from "recoil";
import { tokenState } from "store/tokenState";
import { Suspense, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import useLogin from "hooks/useLogin";
import MainLayout from "components/MainLayout";
import { TOKEN } from "constant";
import LoginRouter from "./LoginRouter";
import MainRouter from "./MainRouter";

const Router = function () {
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

  return (
    <BrowserRouter>
      {sessionStorageToken || localStorageToken ? (
        <MainLayout
          content={
            <Suspense fallback="loading">
              <MainRouter />
            </Suspense>
          }
        />
      ) : (
        <Suspense fallback="loading">
          <LoginRouter />
        </Suspense>
      )}
    </BrowserRouter>
  );
};

export default Router;
