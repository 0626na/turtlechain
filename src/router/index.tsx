import { useRecoilState } from "recoil";
import { tokenState } from "store/tokenState";
import { Suspense, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Layout } from "antd";
import Header from "components/Header";
import Sider from "components/Sider";
import {
  LoginPage,
  FindIdPage,
  ResetPasswordPage,
  SignupPage,
  HomePage,
} from "pages";
import { TOKEN_NAME } from "constant/string";

const Router = function () {
  const localStorageToken = localStorage.getItem(TOKEN_NAME);
  const [storeToken, setToken] = useRecoilState(tokenState);

  useEffect(() => {
    if (localStorageToken) {
      setToken(localStorageToken);
    }
  }, []);

  if (localStorageToken && !storeToken) return null;

  return (
    <BrowserRouter>
      <Suspense fallback="로딩중...">
        {storeToken ? (
          <Layout>
            <Header />
            <Layout>
              <Sider />
              <Switch>
                <Route exact path="/home" component={HomePage} />
                <Redirect path="*" to="/home" />
              </Switch>
            </Layout>
          </Layout>
        ) : (
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/find-id" component={FindIdPage} />
            <Route exact path="/reset-password" component={ResetPasswordPage} />
            <Route exact path="/signup" component={SignupPage} />
            <Redirect path="*" to="/login" />
          </Switch>
        )}
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
