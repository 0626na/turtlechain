import { Helmet } from "react-helmet";
import Template from "./FindIdPageTemplate";
import Form from "./FindIdForm";

const FindIdPage = function () {
  return (
    <Template>
      <Helmet title="터틀체인 - 아이디 찾기" />
      <Form />
    </Template>
  );
};

export default FindIdPage;
