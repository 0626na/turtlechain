import { Helmet } from "react-helmet";
import Template from "./ResetPasswordPageTemplate";
import Form from "./ResetPasswordForm";

const FindIdPage = function () {
  return (
    <Template>
      <Helmet title="터틀체인 - 비밀번호 재설정" />
      <Form />
    </Template>
  );
};

export default FindIdPage;
