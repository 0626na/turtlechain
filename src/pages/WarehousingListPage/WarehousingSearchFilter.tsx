import moment from "moment";
import { useTranslation } from "react-i18next";
import { RequestGetSheet } from "apis/warehousingAPI";

import { Form, DatePicker, Select } from "antd";
import StoreSelect from "components/StoreSelect";

interface Props {
  searchQuery: RequestGetSheet;
  onChangeStore: (mall_id: number | "") => void;
  onChangeDate: (start_date: string, end_date: string) => void;
  onChangeConfirmed: (is_confirmed: number | "") => void;
}

const WarehousingSearchFilter = function ({
  searchQuery,
  onChangeStore,
  onChangeDate,
  onChangeConfirmed,
}: Props) {
  const { t } = useTranslation();
  const { mall_id, start_date, end_date, is_confirmed } = searchQuery;

  return (
    <Form layout="inline">
      <Form.Item label={t("mall")}>
        <StoreSelect
          emptyValueText={t("all")}
          width={250}
          value={mall_id}
          onChange={(value) => {
            onChangeStore(value);
          }}
        />
      </Form.Item>
      <Form.Item label={t("warehousing time")}>
        <DatePicker.RangePicker
          allowClear={false}
          value={[moment(start_date), moment(end_date)]}
          onChange={(_, dateStrings) => {
            const start_date = dateStrings[0];
            const end_date = dateStrings[1];
            onChangeDate(start_date, end_date);
          }}
        />
      </Form.Item>
      <Form.Item label={t("progress")}>
        <Select
          style={{ width: 100 }}
          value={is_confirmed}
          onChange={(value) => {
            onChangeConfirmed(value);
          }}
        >
          <Select.Option value="">{t("all")}</Select.Option>
          <Select.Option value={0}>
            {t("warehousing unconfirmed")}
          </Select.Option>
          <Select.Option value={1}>
            {t("warehousing confirmed")}
          </Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default WarehousingSearchFilter;
