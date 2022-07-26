// import { Switch, Route, Redirect } from 'react-router-dom';
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
      {/* <Switch> */}
      {/* <Route path="/login" component={LoginPage} />
        <Route path="/find-id" component={FindIdPage} />
        <Route path="/reset-password" component={ResetPasswordPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/membership-info" component={MembershipInfoPage} /> */}
      {/* <Redirect path="*" to="/login" /> */}
      {/* </Switch> */}
    </Suspense>
  );
};

export default LoginRouter;
