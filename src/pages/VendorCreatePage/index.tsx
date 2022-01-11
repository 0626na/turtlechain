import PageHeader from "components/PageHeader";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

function VendorCreatePage() {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("vendor.create")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="Vendor"
        title={t("vendor.create")}
        breadcrumbList={[t("vendor.management"), t("vendor.create")]}
      />
    </>
  );
}

export default VendorCreatePage;
