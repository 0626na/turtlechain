import { useTranslation } from "react-i18next";

import { Form, DatePicker, Select } from "antd";
import StoreSelect from "components/StoreSelect";

interface Props {}

const AdjustmentSearchFilter = function ({}: Props) {
  const { t } = useTranslation();
  return (
    <Form layout="inline">
      <Form.Item label={t("mall")}>
        <StoreSelect emptyValueText={t("all")} width={250} />
      </Form.Item>
      <Form.Item label={t("adjustment date")}>
        <DatePicker.RangePicker allowClear={false} />
      </Form.Item>
      <Form.Item label={t("progress")}>
        <Select style={{ width: 100 }}>
          <Select.Option value="">{t("all")}</Select.Option>
          <Select.Option value={0}>{t("adjustment unconfirmed")}</Select.Option>
          <Select.Option value={1}>{t("adjustment confirmed")}</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default AdjustmentSearchFilter;
