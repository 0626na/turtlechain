import { useTranslation } from "react-i18next";
import { Form, DatePicker } from "antd";
import StoreSelect from "components/StoreSelect";
import CustomStoreSelect from "components/CustomStoreSelect";

interface Props {}

const OrderSearchFilter = function ({}: Props) {
  const { t } = useTranslation();
  return (
    <Form layout="inline">
      <CustomStoreSelect />
      <Form.Item label={`${t("date")} ${t("search")}`}>
        <DatePicker.RangePicker allowClear={false} />
      </Form.Item>
    </Form>
  );
};

export default OrderSearchFilter;
