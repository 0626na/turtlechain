// lang
import { t } from "i18next";
// antd
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import { PageHeader, Typography } from "antd";

const MyStorePageHeader = function () {
  return (
    <PageHeader title={t("store.info")}>
      <Typography.Text type="secondary">
        <InfoIcon /> {t("description.first way to manage malls")}
      </Typography.Text>
      <br />
      <Typography.Text type="secondary">
        <InfoIcon /> {t("description.second way to manage malls")}
      </Typography.Text>
    </PageHeader>
  );
};

export default MyStorePageHeader;
