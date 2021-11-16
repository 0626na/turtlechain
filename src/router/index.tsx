import { useRecoilState } from "recoil";
import { tokenState } from "store/tokenState";
import { Suspense, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import MainLayout from "components/MainLayout";
import { TOKEN_NAME } from "constant/string";
import LoginRouter from "./LoginRouter";
import MainRouter from "./MainRouter";

const Router = function () {
  const localStorageToken = localStorage.getItem(TOKEN_NAME);
  const [storeToken, setToken] = useRecoilState(tokenState);

  useEffect(() => {
    if (localStorageToken) {
      setToken(localStorageToken);
    }
  }, []);

  if (localStorageToken && !storeToken) {
    return null;
  } else {
    return (
      <BrowserRouter>
        <Suspense fallback="로딩중...">
          {storeToken ? (
            <MainLayout content={<MainRouter />} />
          ) : (
            <LoginRouter />
          )}
        </Suspense>
      </BrowserRouter>
    );
  }
};

export default Router;
