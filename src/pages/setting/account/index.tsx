import { t } from "i18next";
import { PageHeader } from "layouts/main";
import { Helmet } from "react-helmet";
import PageBody from "./PageBody";

function AccountManagementPage() {
  const title = `${t("turtlechain")} - ${t("account.management")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("account.management")}
        breadcrumbList={[t("setting"), t("account.management")]}
      />
      <PageBody />
    </>
  );
}

export default AccountManagementPage;
