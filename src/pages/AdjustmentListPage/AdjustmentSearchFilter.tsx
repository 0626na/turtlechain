import { useTranslation } from "react-i18next";
import { Form, DatePicker, Select } from "antd";
import StoreSelect from "components/StoreSelect";
import moment from "moment";
import { RequestGetAdjustmentList } from "apis/adjustmentAPI";
import { BaseOptionType } from "antd/lib/select";

interface Props {
  searchQuery: RequestGetAdjustmentList;
  setSearchQuery: React.Dispatch<React.SetStateAction<RequestGetAdjustmentList>>;

}

const AdjustmentSearchFilter = function ({ searchQuery, setSearchQuery }: Props) {
  const { t } = useTranslation();

  const selectOptions: BaseOptionType[] = [
    { name: "전체", value: "all"},
    { name: "미송", value: "reserve" },
    { name: "교환", value: "exchange" },
    { name: "반품", value: "takeback" },
    { name: "잔", value: "balance" },
  ];
  return (
    <Form layout="inline">
      <Form.Item label={t("adjustment date")}>
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
        value={searchQuery.is_cleared}
        defaultValue={2}
        onChange={(is_cleared)=>{
          setSearchQuery({...searchQuery, is_cleared})
        } }
        >
          <Select.Option value={2}>{t("all")}</Select.Option>
          <Select.Option value={0}>{t("waiting")}</Select.Option>
          <Select.Option value={1}>{t("confirmed")}</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label={t("adjustment type")}>
        <Select 
        style={{ width: 100 }}
        value={searchQuery.type}
        onChange={(type)=>{
          setSearchQuery({...searchQuery, type})
        }}
        >
        {selectOptions.map((option) => {
      
      return <Select.Option value={option.value}>{option.name}</Select.Option>
     
     })}; 

        </Select>
      </Form.Item>
    </Form>
  );
};

export default AdjustmentSearchFilter;
