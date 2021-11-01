import { Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { LoginPage, FindIdPage, ResetPasswordPage, SignupPage } from "pages";

const Router = function () {
  return (
    <BrowserRouter>
      <Switch>
        <Suspense fallback="로딩중...">
          <Route path="/login" component={LoginPage} />
          <Route path="/find-id" component={FindIdPage} />
          <Route path="/reset-password" component={ResetPasswordPage} />
          <Route path="/signup" component={SignupPage} />
        </Suspense>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
