import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import PageTemplate from "./PageTemplate";
import FindIdForm from "./FindIdForm";

const FindIdPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("find id")}`;
  return (
    <PageTemplate>
      <Helmet title={title} />
      <FindIdForm />
    </PageTemplate>
  );
};

export default FindIdPage;
