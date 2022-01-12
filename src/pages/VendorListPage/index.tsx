import PageHeader from "components/PageHeader";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Filter from "./Filter";
import VendorList from "./VendorList";

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
      <Filter />
      <VendorList />
    </>
  );
}

export default VendorListPage;
