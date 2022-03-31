import { t } from "i18next";
import { PageHeader } from "layouts/page";
import { Helmet } from "react-helmet";

function SampleReturnListPage() {
  const title = `${t("turtlechain")} - ${t("sample_return.list")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("sample_return.list")}
        breadcrumbList={[t("sample_return.management"), t("sample_return.list")]}
      />
    </>
  );
}

export default SampleReturnListPage;
