import PageHeader from "components/PageHeader";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Toolbar from "./Toolbar";
import VendorCreateForm from "./VendorCreateForm";

function VendorCreatePage() {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("vendor.create")}`;

  const [storeId, setStoreId] = useState<number>(-1);

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="vendor"
        title={t("vendor.create")}
        breadcrumbList={[t("common.home"), t("vendor.management"), t("vendor.create")]}
        info={t("description.search vendor")}
      />
      <Toolbar selectStore={setStoreId} />
      <VendorCreateForm storeId={storeId} />
    </>
  );
}

export default VendorCreatePage;
