import PageHeader from "components/PageHeader";
import { t } from "i18next";
import { Helmet } from "react-helmet";

function SampleReturnCreatePage() {
  const title = `${t("turtlechain")} - ${t("sample_return.create")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="sample_return"
        title={t("sample_return.create")}
        breadcrumbList={[
          t("common.home"),
          t("sample_return.management"),
          t("sample_return.create"),
        ]}
      />
    </>
  );
}

export default SampleReturnCreatePage;
