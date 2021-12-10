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
  const { login } = useLogin();
  const localStorageToken = localStorage.getItem(TOKEN);
  const storeToken = useRecoilValue(tokenState);

  useEffect(() => {
    if (localStorageToken) {
      login(localStorageToken);
    }
  }, []);

  if (localStorageToken && !storeToken) {
    return null;
  } else {
    return (
      <BrowserRouter>
        {storeToken ? (
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
  }
};

export default Router;
