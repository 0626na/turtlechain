import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

import { Form } from "antd";

import PageHeader from "components/PageHeader";
import SvgIcon from "components/SvgIcon";
import StoreSelect from "components/StoreSelect";

import AdjustmentCreateForm from "./AdjustmentCreateForm";

const AdjustmentCreatePage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("adjustment create")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        icon={
          <SvgIcon
            filled={false}
            src={`${process.env.PUBLIC_URL}/assets/svg/check-list.svg`}
            alt="adjustment"
          />
        }
        title={t("adjustment create")}
        breadcrumbList={[t("adjustment management"), t("adjustment create")]}
      />
      <Form>
        <StoreSelect
          width={200}
          emptyValueText={`${t("mall")} ${t("select")}`}
        />
      </Form>
      <AdjustmentCreateForm />
    </>
  );
};

export default AdjustmentCreatePage;
