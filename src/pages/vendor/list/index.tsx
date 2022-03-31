import { Helmet } from "react-helmet";
import { t } from "i18next";
import { PageHeader } from "layouts/main";
import VendorList from "./VendorList";

function VendorListPage() {
  const title = `${t("turtlechain")} - ${t("vendor.list")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("vendor.list")}
        breadcrumbList={[t("vendor.management"), t("vendor.list")]}
      />
      <VendorList />
    </>
  );
}

export default VendorListPage;
