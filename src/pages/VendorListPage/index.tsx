import PageHeader from "components/PageHeader";
import { Helmet } from "react-helmet";
import VendorList from "./VendorList";
import { t } from "i18next";

function VendorListPage() {
  const title = `${t("turtlechain")} - ${t("vendor.list")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="vendor"
        title={t("vendor.list")}
        breadcrumbList={[t("common.home"), t("vendor.management"), t("vendor.list")]}
      />
      <VendorList />
    </>
  );
}

export default VendorListPage;
