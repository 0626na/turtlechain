import moment from "moment";
import { useTranslation } from "react-i18next";
import { RequestGetSheet } from "apis/warehousingAPI";
import { Form, DatePicker, Select } from "antd";
import StoreSelect from "components/StoreSelect";

interface Props {
  searchQuery: RequestGetSheet;
  setSearchQuery: React.Dispatch<React.SetStateAction<RequestGetSheet>>;
}

const WarehousingSearchFilter = function ({ searchQuery, setSearchQuery }: Props) {
  const { t } = useTranslation();
  return (
    <Form layout="inline">
      <Form.Item label={t("warehousing.date")}>
        <DatePicker.RangePicker
          allowClear={false}
          value={[moment(searchQuery.start_date), moment(searchQuery.end_date)]}
          onChange={(_, dateStrings) => {
            const start_date = dateStrings[0];
            const end_date = dateStrings[1];
            setSearchQuery({ ...searchQuery, start_date, end_date });
          }}
        />
      </Form.Item>
      <Form.Item label={t("progress")}>
        <Select
          style={{ width: 100 }}
          value={searchQuery.is_confirmed}
          onChange={(is_confirmed) => {
            setSearchQuery({ ...searchQuery, is_confirmed });
          }}
        >
          <Select.Option value="">{t("all")}</Select.Option>
          <Select.Option value={0}>{t("waiting")}</Select.Option>
          <Select.Option value={1}>{t("confirmed")}</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default WarehousingSearchFilter;
