import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Template from "./ResetPasswordPageTemplate";
import Form from "./ResetPasswordForm";

const FindIdPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("reset password")}`;
  return (
    <Template>
      <Helmet title={title} />
      <Form />
    </Template>
  );
};

export default FindIdPage;
