import { Helmet } from "react-helmet";
import CreateVendorForm from "./CreateVendorForm";
import { t } from "i18next";
import { PageHeader } from "layouts/main";

function VendorCreatePage() {
  const title = `${t("turtlechain")} - ${t("vendor.create")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("vendor.create")}
        breadcrumbList={[t("vendor.management"), t("vendor.create")]}
        info={t("description.search vendor")}
      />
      <CreateVendorForm />
    </>
  );
}

export default VendorCreatePage;
