import { Helmet } from "react-helmet";
import { t } from "i18next";
import FindIdForm from "./FindIdForm";
import { LoginPageBody } from "layouts/login";

function FindIdPage() {
  const title = `${t("turtlechain")} - ${t("find id")}`;

  return (
    <>
      <Helmet title={title} />
      <LoginPageBody>
        <FindIdForm />
      </LoginPageBody>
    </>
  );
}

export default FindIdPage;
