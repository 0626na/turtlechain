import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Template from "./FindIdPageTemplate";
import Form from "./FindIdForm";

const FindIdPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("find id")}`;
  return (
    <Template>
      <Helmet title={title} />
      <Form />
    </Template>
  );
};

export default FindIdPage;
