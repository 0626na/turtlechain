import { RequestGetVendors } from "apis/vendorAPI";
import PageHeader from "components/PageHeader";
import { useCallback, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Toolbar from "./Toolbar";
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
      <Toolbar />
      <VendorList />
    </>
  );
}

export default VendorListPage;
