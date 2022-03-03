import { t } from "i18next";
import { Helmet } from "react-helmet";
import TurtleTemplate from "components/common/TurtleTemplate";
import LoginForm from "./LoginForm";

const LoginPage = function () {
  const title = `${t("turtlechain")} - ${t("login")}`;

  return (
    <>
      <Helmet title={title} />
      <TurtleTemplate>
        <LoginForm />
      </TurtleTemplate>
    </>
  );
};

export default LoginPage;
