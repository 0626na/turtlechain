import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Template from "./LoginPageTemplate";
import Form from "./LoginForm";

const LoginPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("login")}`;
  return (
    <Template>
      <Helmet title={title} />
      <Form />
    </Template>
  );
};

export default LoginPage;
