import { Suspense } from "react";
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

const Router = function () {
  const token = "";
  return (
    <BrowserRouter>
      <Suspense fallback="로딩중...">
        {token ? (
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
