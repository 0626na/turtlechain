import { useTranslation } from "react-i18next";
import { Form, DatePicker } from "antd";
import StoreSelect from "components/StoreSelect";

interface Props {}

const OrderSearchFilter = function ({}: Props) {
  const { t } = useTranslation();
  return (
    <Form layout="inline">
      <Form.Item label={t("mall")}>
        <StoreSelect emptyValueText={t("all")} width={200} />
      </Form.Item>
      <Form.Item label={`${t("date")} ${t("search")}`}>
        <DatePicker.RangePicker allowClear={false} />
      </Form.Item>
    </Form>
  );
};

export default OrderSearchFilter;
