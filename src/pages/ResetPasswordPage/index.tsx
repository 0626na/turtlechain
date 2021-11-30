import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import PageTemplate from "./PageTemplate";
import ResetPasswordForm from "./ResetPasswordForm";

const FindIdPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("reset password")}`;
  return (
    <PageTemplate>
      <Helmet title={title} />
      <ResetPasswordForm />
    </PageTemplate>
  );
};

export default FindIdPage;
