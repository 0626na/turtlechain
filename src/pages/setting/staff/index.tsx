import { t } from "i18next";
import { PageHeader } from "layouts/main";
import { Helmet } from "react-helmet";
import PageBody from "./PageBody";

function StaffManagementPage() {
  const title = `${t("turtlechain")} - ${t("staff.management")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("staff.management")}
        breadcrumbList={[t("setting"), t("staff.management")]}
      />
      <PageBody />
    </>
  );
}

export default StaffManagementPage;
