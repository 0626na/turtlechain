import { Switch, Route, Redirect } from 'react-router-dom';
import {
  LoginPage,
  FindIdPage,
  ResetPasswordPage,
  SignupPage,
  MembershipInfoPage,
} from '@pages/index';
import { Suspense } from 'react';

const LoginRouter = function () {
  return (
    <Suspense fallback="loading">
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/find-id" component={FindIdPage} />
        <Route exact path="/reset-password" component={ResetPasswordPage} />
        <Route exact path="/signup" component={SignupPage} />
        <Route exact path="/membership-info" component={MembershipInfoPage} />
        <Redirect path="*" to="/login" />
      </Switch>
    </Suspense>
  );
};

export default LoginRouter;
