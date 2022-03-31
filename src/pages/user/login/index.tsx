import { t } from "i18next";
import { LoginPageBody } from "layouts/login";
import { Helmet } from "react-helmet";
import LoginForm from "./LoginForm";

function LoginPage() {
  const title = `${t("turtlechain")} - ${t("login")}`;

  return (
    <>
      <Helmet title={title} />
      <LoginPageBody>
        <LoginForm />
      </LoginPageBody>
    </>
  );
}

export default LoginPage;
