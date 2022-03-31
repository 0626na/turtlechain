import { t } from "i18next";
import { PageHeader } from "layouts/page";
import { Helmet } from "react-helmet";

function SampleReturnCreatePage() {
  const title = `${t("turtlechain")} - ${t("sample_return.create")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("sample_return.create")}
        breadcrumbList={[t("sample_return.management"), t("sample_return.create")]}
      />
    </>
  );
}

export default SampleReturnCreatePage;
