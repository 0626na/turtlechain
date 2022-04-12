import { Switch, Route, Redirect } from "react-router-dom";
import { LoginPage, FindIdPage, ResetPasswordPage, SignupPage } from "pages";
import { Suspense } from "react";

const LoginRouter = function () {
  return (
    <Suspense fallback="loading">
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/find-id" component={FindIdPage} />
        <Route exact path="/reset-password" component={ResetPasswordPage} />
        <Route exact path="/signup" component={SignupPage} />
        <Redirect path="*" to="/login" />
      </Switch>
    </Suspense>
  );
};

export default LoginRouter;
