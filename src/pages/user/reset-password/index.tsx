import { Helmet } from "react-helmet";
import { t } from "i18next";
import ResetPasswordForm from "./ResetPasswordForm";
import { LoginPageBody } from "layouts/login";

function FindIdPage() {
  const title = `${t("turtlechain")} - ${t("reset password")}`;

  return (
    <>
      <Helmet title={title} />
      <LoginPageBody>
        <ResetPasswordForm />
      </LoginPageBody>
    </>
  );
}

export default FindIdPage;
