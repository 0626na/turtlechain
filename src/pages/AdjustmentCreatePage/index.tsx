import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import PageHeader from "components/PageHeader";
import StoreSelect from "components/StoreSelect";
import AdjustmentCreateForm from "./AdjustmentCreateForm";
import AdjustmentPreviewList from "./AdjustmentPreviewList";

const AdjustmentCreatePage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("adjustment create")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="adjustment"
        title={t("adjustment create")}
        breadcrumbList={[t("adjustment management"), t("adjustment create")]}
      />
      <Form>
        <StoreSelect />
      </Form>
      <AdjustmentCreateForm />
      <AdjustmentPreviewList />
    </>
  );
};

export default AdjustmentCreatePage;
