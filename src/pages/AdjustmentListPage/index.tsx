import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import PageHeader from "components/PageHeader";
import SvgIcon from "components/SvgIcon";
import AdjustmentSearchFilter from "./AdjustmentSearchFilter";
import AdjustmentList from "./AdjustmentList";
import Toolbar from "./Toolbar";

const AdjustmentListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("adjustment list")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="adjustment"
        title={t("adjustment list")}
        breadcrumbList={[t("adjustment management"), t("adjustment list")]}
      />
      <Toolbar/>
      <AdjustmentSearchFilter />
      <AdjustmentList />
    </>
  );
};

export default AdjustmentListPage;
