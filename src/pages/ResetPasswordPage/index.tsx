import { Helmet } from "react-helmet";
import { t } from "i18next";
import ResetPasswordForm from "./ResetPasswordForm";
import TurtleTemplate from "components/common/TurtleTemplate";

const FindIdPage = function () {
  const title = `${t("turtlechain")} - ${t("reset password")}`;

  return (
    <>
      <Helmet title={title} />
      <TurtleTemplate>
        <ResetPasswordForm />
      </TurtleTemplate>
    </>
  );
};

export default FindIdPage;
