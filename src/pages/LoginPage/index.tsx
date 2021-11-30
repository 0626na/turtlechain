import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import PageTemplate from "./PageTemplate";
import LoginForm from "./LoginForm";

const LoginPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("login")}`;
  return (
    <PageTemplate>
      <Helmet title={title} />
      <LoginForm />
    </PageTemplate>
  );
};

export default LoginPage;
