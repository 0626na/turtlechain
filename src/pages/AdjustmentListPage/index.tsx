import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import PageHeader from "components/PageHeader";
import SvgIcon from "components/SvgIcon";
import AdjustmentSearchFilter from "./AdjustmentSearchFilter";
import AdjustmentList from "./AdjustmentList";

const AdjustmentListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("adjustment list")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        icon={
          <SvgIcon
            filled={false}
            src={`${process.env.PUBLIC_URL}/assets/svg/adjustment.svg`}
            alt="adjustment"
          />
        }
        title={t("adjustment list")}
        breadcrumbList={[t("adjustment management"), t("adjustment list")]}
      />
      <AdjustmentSearchFilter />
      <AdjustmentList />
    </>
  );
};

export default AdjustmentListPage;
