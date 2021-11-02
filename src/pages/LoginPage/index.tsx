import { Helmet } from "react-helmet";
import Template from "./LoginPageTemplate";
import Form from "./LoginForm";

const LoginPage = function () {
  return (
    <Template>
      <Helmet title="터틀체인 - 로그인" />
      <Form />
    </Template>
  );
};

export default LoginPage;
