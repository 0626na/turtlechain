import PageHeader from "components/PageHeader";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

function VendorListPage() {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("vendor.list")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="Vendor"
        title={t("vendor.list")}
        breadcrumbList={[t("vendor.management"), t("vendor.list")]}
      />
    </>
  );
}

export default VendorListPage;
