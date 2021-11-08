import { Helmet } from "react-helmet";
import SignupPageTemplate from "./SignupPageTemplate";

const SignupPage = function () {
  return (
    <SignupPageTemplate>
      <Helmet title="터틀체인 - 서비스 가입신청" />
      <h1>서비스 가입신청 페이지</h1>
    </SignupPageTemplate>
  );
};

export default SignupPage;
