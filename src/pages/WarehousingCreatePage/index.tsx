import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

import PageHeader from "components/PageHeader";
import SvgIcon from "components/SvgIcon";

import WarehousingCreateForm from "./WarehousingCreateForm";
import WarehousingPreviewList from "./WarehousingPreviewList";

const WarehousingCreatePage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("warehousing create")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        icon={
          <SvgIcon
            filled={false}
            src={`${process.env.PUBLIC_URL}/assets/svg/warehousing.svg`}
            alt="warehousing"
          />
        }
        title={t("warehousing create")}
        breadcrumbList={[t("warehousing management"), t("warehousing create")]}
      />
      <WarehousingCreateForm />
      <WarehousingPreviewList />
    </>
  );
};

export default WarehousingCreatePage;
